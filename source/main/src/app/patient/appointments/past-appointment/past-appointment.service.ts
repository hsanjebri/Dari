import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { visite } from './past-appointment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})

export class PastAppointmentService extends UnsubscribeOnDestroyAdapter {

  private readonly API_URL = 'http://localhost:8085/Examen/visites/getall';
  private readonly API_URL_ADD = 'http://localhost:8085/Examen/visites/add';
  private readonly API_URL_DELETE = 'http://localhost:8085/Examen/visites/delete/';

  isTblLoading = true;
  dataChange: BehaviorSubject<visite[]> = new BehaviorSubject<
    visite[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: visite;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): visite[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllPastAppointment(): void {
    this.subs.sink = this.httpClient
      .get<visite[]>(this.API_URL)
      .subscribe({
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
  addPastAppointment(appointment: visite): void {
    this.dialogData = appointment;

    this.httpClient.post(this.API_URL_ADD, appointment)
      .subscribe({
        next: (data) => {
          this.dialogData = appointment;
        },
        error: (error: HttpErrorResponse) => {
           // error code here
        },
      });
  }
  updatePastAppointment(appointment: visite): void {
    this.dialogData = appointment;

    // this.httpClient.put(this.API_URL + appointment.id, appointment)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = appointment;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deletePastAppointment(id: number): void {
    console.log(id);

    this.httpClient.delete(`${this.API_URL_DELETE}${id}`)
        .subscribe({
          next: (data) => {
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }
}
