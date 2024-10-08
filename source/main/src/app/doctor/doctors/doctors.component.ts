import {Component, inject, OnInit} from '@angular/core';
import { DoctorsService } from './doctors.service'; // Ensure this path is correct
import { Doctors } from './doctors.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {CurrencyPipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button"; // Ensure this path is correct

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent, CurrencyPipe, NgForOf, NgClass, NgIf, DecimalPipe, MatIcon, MatIconButton], // Ensure BreadcrumbComponent is imported correctly
})
export class DoctorsComponent implements OnInit {
  doctors: Doctors[] = [];
  averageRatings: { [key: number]: number } = {}; // Dictionary to store average ratings
  isLoading: boolean = true;
  roomId: string = '';
  route =inject(Router)
  constructor(private doctorsService: DoctorsService,private router:Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorsService.getAllDoctors();
    this.doctorsService.dataChange.subscribe((data: Doctors[]) => {
      this.doctors = data;
      this.isLoading = this.doctorsService.isTblLoading;
      console.log('Doctors Data:', this.doctors); // Debugging line

      // Fetch average rating for each doctor
      this.doctors.forEach((doctor) => {
        this.doctorsService.getAverageRating(doctor.id).subscribe({
          next: (rating) => {
            this.averageRatings[doctor.id] = rating; // Store rating in the dictionary
          },
          error: (error) => {
            console.error('Error fetching average rating:', error.message);
          }
        });
      });
    });
  }

  getRating(doctorId: number): number {
    return this.averageRatings[doctorId] || 0; // Return 0 if rating is not available
  }
  enterRoom() {
    console.log(this.roomId);
    this.route.navigateByUrl(`/room/${this.roomId}`);
  }
}
