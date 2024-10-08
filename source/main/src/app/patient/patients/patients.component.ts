import { Component, OnInit } from '@angular/core';
import { DoctorsService } from './doctors.service'; // Ensure the path is correct
import { Doctors } from './doctors.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import {NgForOf} from "@angular/common"; // Ensure the path is correct

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, NgForOf],
})
export class PatientsComponent implements OnInit {
  doctors: Doctors[] = [];
  isLoading: boolean = true;

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
    });
  }
}
