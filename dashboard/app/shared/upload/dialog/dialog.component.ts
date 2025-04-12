import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {UploadService} from '../../../@core/services/upload.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  providers: [
    UploadService,
  ],
  styles: [
    `
    nb-card {
      min-width: 290px;
    }
    .list-card {
      nb-card-header {
        border-bottom: none;
      }
      nb-card-footer {
        border-top: none;
      }
      nb-card-body {
        padding: 0;
      }
    }
    `
  ],
  standalone: false
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: NbDialogRef<DialogComponent>,
              private uploadService: UploadService) {

  }
  @ViewChild('file', { static: false }) file: ElementRef | undefined;

  public files: Set<File> = new Set();

  @Input() multiple: boolean = false;
  @Input() suffix: string[] = [];

  @Output() finish: EventEmitter<string[]> | undefined;

  progress!: {[key: string]: { progress: Observable<any>, response: Observable<any> }};
  canBeClosed = true;
  primaryButtonText = '上传';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  messages: {[key: string]: string} = {};
  errorMessage = '';

  results: any[] = [];

  ngOnInit() {}

  onFilesAdded() {
    const files: { [key: string]: File } = this.file?.nativeElement.files;
    let errorMessage = '';
    for (const key in files) {
      if (isNaN(parseInt(key, 10))) {
        continue;
      }
      let file = files[key];
      console.log(file)
      let nameArray = file.name.split('.');
      let suffix = nameArray[nameArray.length - 1];
      if (this.suffix.length > 0 && !this.suffix.includes(suffix.toLowerCase())) {
        errorMessage = '此文件类型不支持，只支持: ' + this.suffix.join(',') + '文件格式';
        continue;
      }
      this.files.add(file);
    }
    this.errorMessage = errorMessage;
  }

  addFiles() {
    this.file?.nativeElement.click();
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      this.finish?.emit(this.results);
      return this.dialogRef.close();
    }
    if (this.files.size < 1) {
      this.errorMessage = '选择需要上传的文件!';
      return ;
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe((res: any)=> console.log(res));
      this.progress[key].response.subscribe((res: any) => {
        if (res.hasOwnProperty('statusText')) {
          this.messages[key] = res.statusText;
        } else if (res.hasOwnProperty('status') && res.status != 'ok') {
          this.messages[key] = res.message;
        } else {
          this.results.push(res.filename);
        }
      });
    }

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = '完成';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    // this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      // this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }

  remove(file: File) {
    this.files.delete(file);
  }
}
