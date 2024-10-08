import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Doctors } from './doctors.model'; // Ensure this path is correct

@Injectable({
  providedIn: 'root',
})
export class DoctorsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8085/Examen/realEstateAgents/getall'; // Update this URL if needed
  private readonly API_URL_ADD = 'http://localhost:8085/Examen/realEstateAgents/add'; // Update this URL if needed
  private readonly API_URL_UPDATE = 'http://localhost:8085/Examen/realEstateAgents/update'; // Update this URL if needed
  private readonly API_URL_DELETE = 'http://localhost:8085/Examen/realEstateAgents/delete/'; // Update this URL if needed
  private readonly API_URL_GOAL = 'http://localhost:8085/Examen/realEstateAgents/agents'; // Update this URL if needed
  private readonly API_URL_UPDATE_MONTHLY_GOAL = 'http://localhost:8085/Examen/realEstateAgents/updateMonthlyGoal';
  private readonly API_URL_GET_BYID = 'http://localhost:8085/Examen/realEstateAgents/getbyid/'; // URL for fetching by ID

  isTblLoading = true;
  dataChange: BehaviorSubject<Doctors[]> = new BehaviorSubject<Doctors[]>([]);
  dialogData!: Doctors;

  constructor(private httpClient: HttpClient) {
    super();
    this.getAllDoctors(); // Automatically fetch data on service initialization
  }

  get data(): Doctors[] {
    return this.dataChange.value;
  }

  getDialogData(): Doctors {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllDoctors(): void {
    this.httpClient.get<Doctors[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
        console.log(data)
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.error('Error fetching doctors:', error.message);
      },
    });
  }

  addDoctor(doctor: Doctors): void {
    this.dialogData = doctor;

    this.httpClient.post(this.API_URL_ADD, doctor)
      .subscribe({
        next: () => {
          this.getAllDoctors(); // Refresh data
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding doctor:', error.message);
        },
      });
  }
  getDoctorById(id: number): Observable<Doctors> {
    return this.httpClient.get<Doctors>(`${this.API_URL_GET_BYID}${id}`);
  }
  updateDoctor(doctor: Doctors): void {
    this.dialogData = doctor;

    this.httpClient.put(`${this.API_URL_UPDATE}/${doctor.id}`, doctor)
      .subscribe({
        next: () => {
          this.getAllDoctors(); // Refresh data
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating doctor:', error.message);
        },
      });
  }

  deleteDoctor(id: number): void {
    this.httpClient.delete(`${this.API_URL_DELETE}${id}`)
      .subscribe({
        next: () => {
          console.log('Deleted doctor with ID:', id);
          this.getAllDoctors(); // Refresh data
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting doctor:', error.message);
        },
      });
  }

  getGoalPercentage(agentId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL_GOAL}/${agentId}/goal-percentage`);
  }

  updateMonthlyGoal(agentId: number): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL_UPDATE_MONTHLY_GOAL}/${agentId}`, {});
  }
}
