import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DoctorsService } from "../alldoctors/doctors.service";
import * as LR from "@uploadcare/blocks";
import { NgForOf, NgIf } from "@angular/common";

LR.registerBlocks(LR);

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
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
    FileUploadComponent,
    MatButtonModule,
    NgForOf,
    NgIf,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddDoctorComponent implements OnInit {
  @ViewChild('ctxProvider', { static: true }) ctxProvider!: ElementRef<typeof LR.UploadCtxProvider.prototype>;
  uploadedFiles: LR.OutputFileEntry[] = [];
  docForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private doctorService: DoctorsService) {
    this.docForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: [''],
      typeBien: ['', [Validators.required]],
      surface: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      description: [''],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      img: ['']
    });
  }

  ngOnInit() {
    this.ctxProvider.nativeElement.addEventListener('file-upload-success', this.handleUploadEvent.bind(this));
    this.ctxProvider.nativeElement.addEventListener('done-flow', this.handleDoneFlow.bind(this));
  }

  handleUploadEvent(e: Event) {
    if (!(e instanceof CustomEvent)) return;
    if (e.detail) {
      this.uploadedFiles = [e.detail];
      this.docForm.patchValue({ img: this.uploadedFiles[0]?.cdnUrl || 'default_image_url' });
    }
  }

  handleDoneFlow() {
    console.log('File upload done');
  }

  onSubmit() {
    if (this.docForm.valid) {
      this.doctorService.addDoctors(this.docForm.value).subscribe({
        next: (result) => {
          console.log('Doctor added successfully:', result);
        },
        error: (err) => {
          console.error('Failed to add doctor:', err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
