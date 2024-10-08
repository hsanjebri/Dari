import { Injectable } from '@angular/core';
import { Staff } from './staff.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class StaffService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8085/Examen/annonces'; // Update with your actual API URL
  isTblLoading = true;
  dataChange: BehaviorSubject<Staff[]> = new BehaviorSubject<Staff[]>([]);
  dialogData!: Staff;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Staff[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */

  // Fetch all Annonces (Staff)
  getAllStaffs(): void {
    this.subs.sink = this.httpClient.get<Staff[]>(`${this.API_URL}/getall`).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  // Add a new Annonce (Staff)
  addStaff(staff: Staff): void {
    this.subs.sink = this.httpClient.post<Staff>(`${this.API_URL}/add`, staff)
      .subscribe({
        next: (data) => {
          this.dialogData = data;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding staff', error);
        },
      });
  }

  // Update an Annonce (Staff)
  updateStaff(staff: Staff): void {
    this.subs.sink = this.httpClient.put<Staff>(`${this.API_URL}/update`, staff)
      .subscribe({
        next: (data) => {
          this.dialogData = data;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating staff', error);
        },
      });
  }

  // Delete an Annonce (Staff)
  deleteStaff(id: number): void {
    this.subs.sink = this.httpClient.delete(`${this.API_URL}/delete/${id}`)
      .subscribe({
        next: () => {
          console.log(`Staff with id ${id} deleted`);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting staff', error);
        },
      });
  }
  getStaffById(id: number): Observable<Staff> {
    return this.httpClient.get<Staff>(`${this.API_URL}/getbyid/${id}`);
  }
}
