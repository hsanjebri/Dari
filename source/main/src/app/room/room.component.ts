import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild('root', { static: true }) root!: ElementRef;
  roomID: string = ''; // Change to primitive 'string' type

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomID = params['roomId'];
    });
  }

  ngAfterViewInit(): void {
    const appID = 1405752009;
    const serverSecret = '0883f0a9a8c3da0993c6983e9e10c54b  ';

    // Generate a unique room ID dynamically
    const roomID = Math.random().toString(36).substring(2, 15);

    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID, // Use the dynamically generated roomID here
      Date.now().toString(),
      Date.now().toString(),
    );

    // Create instance object from token
    const zp = ZegoUIKitPrebuilt.create(token);
    zp.joinRoom({
      container: this.root.nativeElement,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol +'//'+
            window.location.host +
            window.location.pathname +
            '?roomID=' +
            roomID, // Use the dynamically generated roomID here
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  }
}
