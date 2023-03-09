import {
  Component, forwardRef, Input,
  OnInit, ViewChild,
} from "@angular/core";
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {buildFormGroup, Control} from "./type";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {ControlContainerComponent} from "./control-container.component";

@Component({
  selector: "group-control",
  templateUrl: "group-control.component.html",
  styleUrls: ["group-control.component.scss"],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupControlComponent),
    multi: true
  }]
})
export class GroupControlComponent implements OnInit, ControlValueAccessor {

  @Input() element!: Control;

  protected onChange: Function = () => {
  };
  protected onTouched: Function = () => {
  };

  private dialogRef: NbDialogRef<any> | undefined;
  values: Record<string, any>[] = [];
  private data: Record<string, any> | Record<string, any>[] | undefined;

  head: Record<string, string>[] = [];
  width: string = "100%"
  private editIndex: number = -1;


  constructor(
    private dialog: NbDialogService,
    private ckfinder: CKFinderService
  ) {
  }


  ngOnInit() {
    if (this.element && this.element.children && this.element.children.length > 0) {
      const head: Record<string, string>[] = [];
      this.element.children.forEach(child => {
        head.push({
          'name': child.label,
          'key': child.id,
          'type': child.type,
        });
        if (child.attachment) {
          if (Array.isArray(child.attachment)) {
            child.attachment.forEach(item => {
              this.ckfinder.addAttachmentUrl(item.id, item.url);
            })
          } else {
            this.ckfinder.addAttachmentUrl(child.attachment.id, child.attachment.url);
          }
        }
      });
      this.head = head;
      this.width = 100 / (head.length + (this.element.multiple ? 1 : 0)) + '%';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    if (this.data != value) {
      this.data = value;
      this.onChange(this.data);
    }
    if (this.element?.multiple) {
      this.values = Array.isArray(value) ? value : (value ? [value] : []);
    } else {
      this.values = value ? [value] : [];
    }
  }

  open() {
    this.dialogRef = this.dialog.open<GroupControlDialogComponent>(GroupControlDialogComponent, {
      dialogClass: 'container',
      closeOnEsc: false,
      closeOnBackdropClick: false
    });
    this.dialogRef.componentRef.instance.initialize(
      this.element,
      this.editIndex
    );
    this.dialogRef.onClose.subscribe((res: Record<string, any> | undefined) => {
      this.editIndex = -1;
      if (res != undefined) {
        this.changeValue(res);
      }
    });
  }

  edit(index: number) {
    if (!this.element?.multiple) {
      return;
    }
    let defaultValue: Record<string, any> = {};
    for (let key in this.values[index]) {
      defaultValue[key] = this.values[index][key];
    }
    this.editIndex = index;
    this.open();
  }

  delete(index: number) {
    if (!this.element?.multiple) {
      return;
    }
    if (Array.isArray(this.data)) {
      const data = [...this.data];
      data.splice(index, 1)
      this.writeValue(data);
    }
  }

  private changeValue(value: Record<string, any>) {
    let changeValue;
    if (this.element?.multiple) {
      if (Array.isArray(this.data)) {
        if (this.editIndex > -1) {
          const data = this.data.map(item => Object.assign(item));
          data[this.editIndex] = value;
          changeValue = data;
        } else {
          changeValue = [...this.data, value];
        }
      } else {
        changeValue = [value];
      }
    } else {
      changeValue = value;
    }
    this.writeValue(changeValue);
  }

  drop($event: CdkDragDrop<any, any>) {
    if (this.values.length > 1) {
      moveItemInArray(this.values, $event.previousIndex, $event.currentIndex);
      this.writeValue(this.values);
    }
  }

  getMedia(value: number) {
    let url: string = '';
    this.element.children?.forEach(control => {
      if ((control.type == 'file' || control.type == 'image' || control.type == 'video' || control.type == 'audio') && control.attachment) {
        if (Array.isArray(control.attachment)) {
          control.attachment.forEach(attach => {
            if (attach.id == value) {
              url = attach.url;
            }
          });
        } else if (control.attachment.id == value) {
          url = control.attachment.url;
        }
      }
    });
    if (!url) {
      url = this.ckfinder.getAttachmentUrl(value);
    } else {
      this.ckfinder.addAttachmentUrl(value, url);
    }
    return url;
  }
}

@Component({
  selector: "group-control-dialog",
  template: `
    <div class="row justify-content-center scrollable">
      <div class="col col-md-6 col-xl-4">
        <nb-card class="scrollable">
          <nb-card-header>{{title}}</nb-card-header>
          <nb-card-body *ngIf="controls.length > 0 && formGroup">
            <control-container [form]="formGroup" [controls]="controls" #containerComponent></control-container>
          </nb-card-body>
          <nb-card-footer class="d-flex justify-content-between">
            <button nbButton status="basic" (click)="cancel()">取消</button>
            <button nbButton status="primary" [disabled]="formGroup?.invalid" (click)="save()">保存</button>
          </nb-card-footer>
        </nb-card>
      </div>
    </div>
  `,
  styles: [
    `
      nb-card {
        max-height: 100vh;
      }
    `
  ],
})
export class GroupControlDialogComponent {
  @Input() controls: Control[] = [];
  @ViewChild('containerComponent') containerComponent!: ControlContainerComponent;

  formGroup: FormGroup | undefined;
  title: string = "";

  constructor(private dialogRef: NbDialogRef<GroupControlDialogComponent>) {
  }

  initialize(element: Control, index: number) {
    this.title = element.label;
    if (element.children && element.children.length > 0) {
      let controls: Control[] = element.children;
      if (element.multiple) {
        controls = [];
        element.children.forEach((item) => {
          let control = Object.assign({}, item);
          if (Array.isArray(item.attachment) && item.attachment.length > 0) {
            control.attachment = index > -1 ? item.attachment[index] || null : null;
          }
          control.value = index > -1 ? item.value[index] || null : null;
          controls.push(control);
        });
      }
      this.controls = controls;
      this.formGroup = buildFormGroup(controls);
    }
  }


  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
    if (this.formGroup?.valid) {
      console.log(this.formGroup.value);
      this.dialogRef.close(this.formGroup.value);
    } else {
      this.dialogRef.close();
    }
  }
}
