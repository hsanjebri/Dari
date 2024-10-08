import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { DoctorsService } from 'app/doctor/doctors/doctors.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatSelectModule } from '@angular/material/select';
import { PatientService } from 'app/admin/patients/allpatients/patient.service';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core';
import * as LR from "@uploadcare/blocks";
import {Doctors} from "../../doctor/doctors/doctors.model";

LR.registerBlocks(LR);

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatOptionModule,
    MatDatepickerModule,
    BreadcrumbComponent,
    MatSelectModule,
    FileUploadComponent,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupComponent implements OnInit {
  @ViewChild('ctxProvider', { static: true }) ctxProvider!: ElementRef<typeof LR.UploadCtxProvider.prototype>;
  uploadedFiles: LR.OutputFileEntry[] = [];
  doc!: Doctors;
  pat!: Patient;
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  selectedRole: string = '';
  hide = true;
  chide = true;
  private readonly API_EMAIL_URL = 'http://localhost:8085/Examen/email/sendEmail';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ds: DoctorsService,
    private ps: PatientService,
    private aut: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.ctxProvider.nativeElement.addEventListener('file-upload-success', this.handleUploadEvent);
    this.ctxProvider.nativeElement.addEventListener('done-flow', this.handleDoneFlow);

    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', [Validators.required, passwordValidator, Validators.minLength(8)]],
      cpassword: ['', [Validators.required, passwordMatchValidator.bind(this)]],
      role: ['', Validators.required],
      address: [''],
      date: ['', [Validators.required, minimumAgeValidator(18)]],
      uploadFile: [''],
      mobile: ['', [Validators.required, mobileValidator]],
      department: [''],
      yearsOfExperience: [''],
      monthlygoal: [''],
      maxgoal: [''],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  handleUploadEvent = (e: Event) => {
    if (!(e instanceof CustomEvent)) return;
    if (e.detail) this.uploadedFiles = [e.detail];
  };

  handleDoneFlow = () => {
    console.log('File upload done');
  };

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.authForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const role = this.authForm.get('role')?.value;

    if (role === 'User') {
      // Map form values to Patient model
      this.pat = {
        id: undefined,
        name: this.authForm.get('username')?.value,
        gender: this.authForm.get('gender')?.value,
        email: this.authForm.get('email')?.value,
        password: this.authForm.get('password')?.value,
        address: this.authForm.get('address')?.value,
        date: this.authForm.get('date')?.value,
        mobile: this.authForm.get('mobile')?.value,
        role: 'USER',
        img: this.uploadedFiles[0]?.cdnUrl || 'default_image_url'
      };

      // Add patient via service and navigate on success
      this.ps.addPatient(this.pat).subscribe(() => {
        this.router.navigate(['/authentication/signin']);
      });

    } if (role === 'Admin') {
      // Map form values to Patient model
      this.pat = {
        id: undefined,
        name: this.authForm.get('username')?.value,
        gender: this.authForm.get('gender')?.value,
        email: this.authForm.get('email')?.value,
        password: this.authForm.get('password')?.value,
        address: this.authForm.get('address')?.value,
        date: this.authForm.get('date')?.value,
        mobile: this.authForm.get('mobile')?.value,
        role: 'ADMIN',
        img: this.uploadedFiles[0]?.cdnUrl || 'default_image_url'
      };

      // Add patient via service and navigate on success
      this.ps.addPatient(this.pat).subscribe(() => {
        this.router.navigate(['/authentication/signin']);
      });

    }
    else if (role === 'Realstateagent') {
      // Handle doctor logic
      this.doc = new Doctors({
        name: this.authForm.get('name')?.value,
        email: this.authForm.get('email')?.value,
        department: this.authForm.get('department')?.value,
        yearsOfExperience: this.authForm.get('yearsOfExperience')?.value,
        img: this.uploadedFiles[0]?.cdnUrl || 'default_image_url',
        gender: this.authForm.get('gender')?.value,
        address: this.authForm.get('address')?.value,
        mobile: this.authForm.get('mobile')?.value,
        monthlygoal: this.authForm.get('monthlygoal')?.value || 0,
        maxgoal: this.authForm.get('maxgoal')?.value || 0,
      });

      this.ds.addDoctor(this.doc).subscribe(() => {
        this.router.navigate(['/authentication/signin']);
      });
    }
  }}

// Validators
function minimumAgeValidator(minimumAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthdateValue = control.value;
    const minimumDate = new Date();
    minimumDate.setFullYear(minimumDate.getFullYear() - minimumAge);
    const birthdate = new Date(birthdateValue);

    return birthdate > minimumDate ? { minimumAge: true } : null;
  };
}

// function uniqueEmailValidator(userService: DoctorsService) {
//   return (control: AbstractControl) => {
//     return new Promise((resolve) => {
//       if (!control.value) resolve(null);
//       else {
//         userService.checkEmailUnique(control.value).subscribe((isUnique) => {
//           resolve(isUnique ? null : { emailNotUnique: true });
//         });
//       }
//     });
//   };
// }

function mobileValidator(control: FormControl) {
  const mobilePattern = /^[0-9]{8}$/;
  return !mobilePattern.test(control.value) ? { invalidMobile: true } : null;
}

function passwordMatchValidator(control: FormControl) {
  const password = control.root.get('password');
  const confirmPassword = control.root.get('cpassword');
  if (!password || !confirmPassword || confirmPassword.value === '') return null;
  return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
}

function passwordValidator(control: FormControl) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return !passwordPattern.test(control.value) ? { passwordRequirements: true } : null;
}
