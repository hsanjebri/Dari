import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {NgForOf, NgIf} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StaffService } from "../allstaff/staff.service";
import { Staff } from '../allstaff/staff.model';
import { RoomService } from "../../room/allroom/room.service";
import { Room } from "../../room/allroom/room.model";
import {Direction} from "@angular/cdk/bidi";
import {FormDialogComponent} from "../../room/allroom/dialog/form-dialog/form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    NgForOf,
    FormsModule,
    MatTooltip,
    NgIf,
  ],
})
export class StaffProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  staff: Staff | undefined;
  exampleDatabase?: RoomService;
  annonceId: number | undefined;
  room: Room = {
    id: 0, // Provide a default value for id
    prixachat: 0, // Initialize with a default value
    dateachat: new Date().toISOString().split('T')[0], // 'yyyy-MM-dd' format
    annonce: 0, // Initialize with a default value or set later
    buyer: '', // Initialize with an empty string
    status: '', // Initialize with an empty string
    seller: '', // Initialize with an empty string
    expdate: new Date().toISOString().split('T')[0], // 'yyyy-MM-dd' format

  };
  signature: any;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private roomService: RoomService
  ) {
    super();}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // Get the ID from the route
      console.log('room object before sending:', this.room);
      if (id) {
        this.annonceId = +id; // Convert string ID to number
        this.staffService.getStaffById(this.annonceId).subscribe({
          next: (data) => {
            this.staff = data;
            console.log('room object before sending:', this.room);
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  saveContract(): void {

  }

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        room: this.room,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.roomService.getDialogData()
        );
       // this.refreshTable();
       //  this.showNotification(
       //    'snackbar-success',
       //    'Add Record Successfully...!!!',
       //    'bottom',
       //    'center'
       //  );
      }
    });






















  }

}

