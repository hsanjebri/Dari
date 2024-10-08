import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Doctors } from './doctors.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8085/Examen/biensimmobiliers'; // Update with your actual API URL
  isTblLoading = true;
  dataChange: BehaviorSubject<Doctors[]> = new BehaviorSubject<Doctors[]>([]);
  dialogData!: Doctors;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Doctors[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */

  // Fetch all doctors
  getAllDoctors(): void {
    this.subs.sink = this.httpClient.get<Doctors[]>(`${this.API_URL}/getall`).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        data.forEach(doctor => {
          // Check if the image URL starts with 'http' or 'https'
          if (doctor.img && (doctor.img.startsWith('http') || doctor.img.startsWith('https'))) {
            // If the image URL is valid, use it
            doctor.img = doctor.img;
          } else {
            // Otherwise, use the default image
           // doctor.img = 'assets/images/sky.jpg'; // Ensure this path is correct
          }
        });
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.error('Error fetching doctors:', error.message);
      },
    });
  }


  // Add a new doctor
  addDoctors(doctors: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/add`, doctors);
  }

  updateDoctors(doctors: Doctors): void {
    this.dialogData = doctors;
    this.httpClient.put<Doctors>(`${this.API_URL}/update`, doctors)
      .subscribe({
        next: (data) => {
          this.dialogData = data;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating doctor', error);
        },
      });
  }

  // Delete a doctor
  deleteDoctors(id: number): void {
    this.httpClient.delete(`${this.API_URL}/delete/${id}`)
      .subscribe({
        next: () => {
          console.log(`Doctor with id ${id} deleted`);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting doctor', error);
        },
      });
  }

  uploadImage(file: File): Observable<{ filePath: string }> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Make sure this returns an observable
    return this.httpClient.post<{ filePath: string }>(`${this.API_URL}/upload-image`, formData);
  }

  getUs(){
    return this.httpClient.get<Doctors[]>(this.API_URL)
  }
}
