import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DialogComponent} from './dialog/dialog.component';
import {NbDialogService} from '@nebular/theme';
import {NbComponentStatus} from "@nebular/theme/components/component-status";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styles: [
    `:host {display: block}`
  ],
  standalone: false
})
export class UploadComponent {

  @Input() multiple = false;
  @Input() text = '上传';
  @Input() status: NbComponentStatus = 'primary';
  @Input() suffix: string[] = [];

  @Output() finish: EventEmitter<string[]> = new EventEmitter();

  constructor(private dialog: NbDialogService) { }

  openUploadDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
    });
    dialogRef.componentRef.instance.multiple = this.multiple;
    dialogRef.componentRef.instance.finish = this.finish;
    dialogRef.componentRef.instance.suffix = this.suffix;
  }
}
