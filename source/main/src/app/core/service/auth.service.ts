import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { Role } from '@core/models/role';
import {PatientService} from "../../admin/patients/allpatients/patient.service";
import {DoctorsService} from "../../doctor/doctors/doctors.service";
import {Patient} from "../../admin/patients/allpatients/patient.model";
import {Doctors} from "../../doctor/doctors/doctors.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8085/Examen/users';
  private readonly API_URLL = 'http://localhost:8085/Examen/realEstateAgents'; // Update this URL if needed
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private patients :Patient[] =[]
  private docotors :Doctors[] =[]

  private users = [
    {
      id: 1,
      img: 'assets/images/user/admin.jpg',
      username: 'admin@hospital.org',
      password: 'admin@123',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: Role.Admin,
      token: 'admin-token',
    },
    {
      id: 2,
      img: 'assets/images/user/doctor.jpg',
      username: 'doctor@hospital.org',
      password: 'doctor@123',
      firstName: 'Ashton',
      lastName: 'Cox',
      role: Role.Doctor,
      token: 'doctor-token',
    },
    {
      id: 3,
      img: 'assets/images/user/patient.jpg',
      username: 'patient@hospital.org',
      password: 'patient@123',
      firstName: 'Cara',
      lastName: 'Stevens',
      role: Role.Patient,
      token: 'patient-token',
    },
  ];

  constructor(private http: HttpClient ,private patientservice: PatientService ,private doctorservice :DoctorsService) {
    this.currentUserSubject = new BehaviorSubject<User>(

      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
      http
      .get<Patient[]>(`${this.API_URL}/getall`)
      .toPromise() // Convert Observable to Promise
      .then((res : any) => {
        console.log('Patients fetched successfully:', res);
        this.patients = res
      })
      .catch((error : any) => {
        console.error('Error fetching patients:', error);
      });

    http
      .get<Patient[]>(`${this.API_URLL}/getall`)
      .toPromise() // Convert Observable to Promise
      .then((res : any) => {
        console.log('Doctors fetched successfully:', res);
        this.docotors = res
      })
      .catch((error : any) => {
        console.error('Error fetching patients:', error);
      });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
     console.log({
       p : this.patients,
       d : this.docotors
     })
    let role = ""
    let user : any = this.patients.find((u) => u.email === username && u.password === password);
    if(!user) {
      role = Role.Doctor
       user  = this.docotors.find((u) => u.email === username && u.password === password);
    }
    if (!user) {
      return this.error('Username or password is incorrect');
    } else {
      console.log("logged in as :", user)
      localStorage.setItem('currentUser', JSON.stringify({...user, role : user.role ? user.role : role ? role : Role.Patient }));
      this.currentUserSubject.next(user);
      return this.ok({
        id: user.id,
        img: user.img,
        username: user.email,
        firstName: user.name,
        lastName: user.lastName,
        token: user.token,
      });
    }
  }
  ok(body?: {
    id: number;
    img: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }
  public getCurrentUserId(): number | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.id : null;
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
