import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoomService } from '../../room.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Room } from '../../room.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";
import {MatCell, MatHeaderCell} from "@angular/material/table";

export interface DialogData {
  id: number;
  action: string;
  room: Room;
}

@Component({
    selector: 'app-form-dialog:not(m)',
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
    MatRadioModule,
    MatDatepickerModule,
    MatDialogClose,
    NgIf,
    MatHeaderCell,
    MatCell,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string | undefined;
  roomForm: UntypedFormGroup;
  room: Room;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public roomService: RoomService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      //this.dialogTitle = data.room.pName;
      this.room = data.room;
    } else {
      this.dialogTitle = 'New Room';
      const blankObject = {} as Room;
      this.room = new Room(blankObject);
    }
    this.roomForm = this.createContactForm();
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
      id: [this.room.id],
      prixachat: [this.room.prixachat],
      dateachat: [this.room.dateachat],
      expdate: [this.room.dateachat],
       buyer: [this.room.buyer],
      seller: [this.room.seller],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.roomService.addRoom(this.roomForm.getRawValue());
  }
}
