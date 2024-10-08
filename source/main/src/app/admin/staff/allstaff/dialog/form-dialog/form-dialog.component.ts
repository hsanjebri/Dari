import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { StaffService } from '../../staff.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Staff } from '../../staff.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

export interface DialogData {
  id: number;
  action: string;
  staff: Staff;
}

@Component({
    selector: 'app-form-dialog:not(n)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatOption,
    MatSelect,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  staffForm: UntypedFormGroup;
  staff: Staff;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public staffService: StaffService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.staff.name;
      this.staff = data.staff;
    } else {
      this.dialogTitle = 'New Staff';
      const blankObject = {} as Staff;
      this.staff = new Staff(blankObject);
    }
    this.staffForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
    createContactForm(): UntypedFormGroup {
        return this.fb.group({
            id: [this.staff.id],
            name: [this.staff.name, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces allowed
            ]],
            email: [this.staff.email, [
                Validators.required,
                Validators.email
            ]],
            date: [
                formatDate(this.staff.date, 'yyyy-MM-dd', 'en'),
                [Validators.required],
            ],
            address: [this.staff.address, [
                Validators.required,
                Validators.maxLength(255) // Address length constraint
            ]],
            agence: [this.staff.agence, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces allowed
            ]],
            description: [this.staff.description, [
                Validators.maxLength(500) // Description length constraint
            ]],
            prix: [this.staff.prix, [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/) // Valid price format
            ]],
            type: [this.staff.type, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces allowed
            ]]
        });
    }

    submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.staffService.addStaff(this.staffForm.getRawValue());
  }
}
