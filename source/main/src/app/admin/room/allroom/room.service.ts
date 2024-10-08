import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Room } from './room.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8085/Examen/contrats'; // Adjust to your backend URL
  isTblLoading = true;
  dataChange: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
  dialogData!: Room;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Room[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllRooms(): void {
    this.subs.sink = this.httpClient.get<Room[]>(`${this.API_URL}/getall`).subscribe({
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
  addRoomwith(annonceId: number, room: Room): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/addwith/${annonceId}`, room);
  }


  addRoom(room: Room): void {
    this.dialogData = room;
    this.httpClient.post<Room>(`${this.API_URL}/add`, room)
      .subscribe({
        next: (data) => {
          this.dialogData = data;
          this.getAllRooms(); // Refresh the list after addition
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        },
      });
  }

  updateRoom(room: Room): void {
    this.dialogData = room;
    this.httpClient.put<Room>(`${this.API_URL}/update`, room)
      .subscribe({
        next: (data) => {
          this.dialogData = data;
          this.getAllRooms(); // Refresh the list after update
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        },
      });
  }

  deleteRoom(id: number): void {
    this.httpClient.delete(`${this.API_URL}/delete/${id}`)
      .subscribe({
        next: () => {
          this.getAllRooms(); // Refresh the list after deletion
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        },
      });
  }

}
