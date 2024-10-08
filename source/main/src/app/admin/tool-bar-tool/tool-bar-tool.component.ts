import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
// @ts-ignore
import { ToolBarToolComponent } from '@progress/kendo-angular-toolbar';
// @ts-ignore
import { SelectEvent } from '@progress/kendo-angular-upload';

@Component({
  providers: [{provide: ToolBarToolComponent, useExisting: forwardRef(() => UploadToolComponent)}],
  selector: 'upload-tool',
  template: `
    <ng-template #toolbarTemplate>
      <div>
        <ng-content></ng-content>
        <kendo-fileselect
          [restrictions]="{ allowedExtensions: [ 'png', 'jpeg' ] }"
          [showFileList]="false"
          (select)="onFileSelect($event)">
          <kendo-fileselect-messages
            select="Browse Image..."
            dropFilesHere="">
          </kendo-fileselect-messages>
        </kendo-fileselect>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [`
    kendo-fileselect.k-upload {
      display: inline-block;
      border: 0
    }
  `]
})
export class UploadToolComponent extends ToolBarToolComponent {
  @Output()
  public valueChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('toolbarTemplate', { static: true })
  public toolbarTemplate!: TemplateRef<any>;

  public onFileSelect(e: SelectEvent): void {
    this.valueChange.emit(e.files[0].rawFile);
  }
}
