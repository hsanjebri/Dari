import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {PastAppointmentService} from "../past-appointment/past-appointment.service";
@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    FileUploadComponent,
    MatButtonModule,
  ],
})
export class BookAppointmentComponent {
  bookingForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  isDisabled = true;
  time: { [key: string]: string } = {
    slot1: '10:30-11:00',
    slot2: '11:00-11:30',
    slot3: '11:30-12:00',
    slot4: '12:00-12:30',
    slot5: '12:30-01:00',
    slot6: '03:30-04:00',
    slot7: '04:00-04:30',
    slot8: '04:30-05:00',
    slot9: '05:00-05:30',
    slot10: '05:30-06:00',
  };

  constructor(private fb: UntypedFormBuilder,    private pastAppointmentService: PastAppointmentService // Inject the service
  ) {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      doctor: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      uploadFile: [''],
    });
  }
  onSubmit() {
    // Get the form value
    const formValue = this.bookingForm.value;

    // Map the selected slot to its corresponding time range
    const selectedSlot = formValue.time;
    const selectedTime = this.time[selectedSlot];

    // Replace the 'time' value with the actual time range
    formValue.time = selectedTime;

    // Submit the form with the updated value
    this.pastAppointmentService.addPastAppointment(formValue);
    console.log('Form Value', formValue);
  }
  get f() {
    return this.bookingForm.controls;
  }
}
