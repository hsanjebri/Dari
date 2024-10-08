import { Component, OnInit } from '@angular/core';
import { DoctorsService } from './doctors.service'; // Ensure the path is correct
import { Doctors } from './doctors.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import {CurrencyPipe, DecimalPipe, NgForOf} from "@angular/common"; // Ensure the path is correct
import { map, forkJoin } from 'rxjs';
import {MatProgressBar} from "@angular/material/progress-bar"; // Import RxJS operators

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, NgForOf, CurrencyPipe, MatProgressBar, DecimalPipe],
})
export class PatientsComponent implements OnInit {
  doctors: Doctors[] = [];
  isLoading: boolean = true;
  goalPercentages: Map<number, number> = new Map(); // Map to store goal percentages

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorsService.getAllDoctors();
    this.doctorsService.dataChange.subscribe((data: Doctors[]) => {
      this.doctors = data;
      this.isLoading = this.doctorsService.isTblLoading;
      console.log('Doctors Data:', this.doctors); // Debugging line

      // Fetch goal percentages for each doctor
      const goalRequests = this.doctors.map(doctor =>
        this.doctorsService.getGoalPercentage(doctor.id).pipe(
          map(percentage => this.goalPercentages.set(doctor.id, percentage))
        )
      );

      forkJoin(goalRequests).subscribe(() => {
        this.isLoading = false; // Stop loading once all percentages are fetched
        console.log('Goal Percentages:', this.goalPercentages); // Debugging line
      });
    });
  }

  getGoalPercentage(doctorId: number): number {
    return this.goalPercentages.get(doctorId) || 0;
  }

  updateMonthlyGoal(doctorId: number): void {
    this.doctorsService.updateMonthlyGoal(doctorId).subscribe({
      next: () => {
        console.log(`Updated monthly goal for doctor ${doctorId}`);
        // Refresh the goal percentage
        this.doctorsService.getGoalPercentage(doctorId).subscribe(percentage => {
          this.goalPercentages.set(doctorId, percentage);
        });
      },
      error: (error) => {
        console.error('Error updating monthly goal:', error.message);
      }
    });
  }
}
