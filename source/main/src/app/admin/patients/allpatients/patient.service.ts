import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Patient } from './patient.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends UnsubscribeOnDestroyAdapter {
  // URL pointing to the backend
  private readonly API_URL = 'http://localhost:8085/Examen/users';
  isTblLoading = true;
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  dialogData!: Patient;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Patient[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllPatients(): any {
    this.subs.sink = this.httpClient.get<Patient[]>(`${this.API_URL}/getall`).subscribe({
      next: (data) => {
        console.log(data)
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  // addPatient(patient: Patient): void {
  //   this.subs.sink = this.httpClient.post<Patient>(`${this.API_URL}/add`, patient).subscribe({
  //     next: (data) => {
  //       this.dialogData = data;
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Error adding patient:', error.message);
  //     },
  //   });
  // }


  addPatient(patient: Patient): Observable<Patient> {
    return this.httpClient.post<Patient>(`${this.API_URL}/add`, patient);
  }
  updatePatient(patient: Patient): void {
    this.subs.sink = this.httpClient.put<Patient>(`${this.API_URL}/update`, patient).subscribe({
      next: (data) => {
        this.dialogData = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating patient:', error.message);
      },
    });
  }

  deletePatient(id: number): void {
    this.subs.sink = this.httpClient.delete(`${this.API_URL}/delete/${id}`).subscribe({
      next: () => {
        console.log(`Patient with id ${id} deleted`);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting patient:', error.message);
      },
    });
  }

  getUs(){
    return this.httpClient.get<Patient[]>("http://localhost:8085/Examen/users/getall")
  }
}
