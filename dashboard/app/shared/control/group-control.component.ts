import {
  Component, Input,
  OnInit, ViewChild,
} from "@angular/core";
import {AbstractControl, FormArray, FormGroup} from "@angular/forms";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {buildFormGroup, Control} from "./type";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {ControlContainerComponent} from "./control-container.component";

@Component({
  selector: "group-control",
  templateUrl: "group-control.component.html",
  styleUrls: ["group-control.component.scss"],
  standalone: false
})
export class GroupControlComponent implements OnInit {

  @Input() direction: string = 'column';

  @Input() element!: Control;

  @Input() form!: AbstractControl;

  elements: Control[] = [];

  protected onChange: Function = () => {};
  protected onTouched: Function = () => {};

  private dialogRef: NbDialogRef<any> | undefined;

  values: Record<string, any>[] = [];

  head: Record<string, string>[] = [];
  width: string = "100%"


  constructor(private dialog: NbDialogService, private ckfinder: CKFinderService) {
  }


  ngOnInit() {
    if (this.element.children && this.element.children.length > 0) {
      const head: Record<string, string>[] = [];
      this.element.children.forEach(child => {
        head.push({
          'name': child.label,
          'key': child.id,
          'type': child.type,
        });
      });
      this.head = head;
      this.width = 100 / (head.length + (this.element.multiple ? 1 : 0)) + '%';
    }
    if (this.element.multiple) {
      this.values = this.arrayForm.getRawValue();
    }
  }

  get groupForm() {
    return this.form as FormGroup;
  }

  get arrayForm() {
    return this.form as FormArray
  }

  open(number: number) {
    let isCreate = false;
    if (this.arrayForm.at(number) == null) {
      this.arrayForm.push(
        new FormGroup(buildFormGroup(this.element.children!))
      );
      isCreate = true;
    }
    this.dialogRef = this.dialog.open<GroupControlDialogComponent>(GroupControlDialogComponent, {
      dialogClass: 'container',
      closeOnEsc: false,
      closeOnBackdropClick: false,
      context: {
        controls: this.element.children!,
        title: this.element.label,
        group: this.arrayForm.at(number) as FormGroup
      },
    });
    this.dialogRef.onClose.subscribe(res=> {
      if (res === 'cancel') {
        if (isCreate) {
          this.arrayForm.removeAt(this.arrayForm.length - 1);
        } else {

        }
      } else {
        this.values = this.arrayForm.getRawValue();
      }
    });
  }

  delete(index: number) {
    this.arrayForm.removeAt(index);
    this.values = this.arrayForm.getRawValue();
  }


  drop($event: CdkDragDrop<any, any>) {
    if (this.values.length > 1) {
      moveItemInArray(this.values, $event.previousIndex, $event.currentIndex);
      this.arrayForm.setValue(this.values);
    }
  }

  getMedia(value: number) {
    return this.ckfinder.getAttachmentUrl(value);
  }
}

@Component({
  selector: "group-control-dialog",
  template: `
    <div class="row justify-content-center scrollable">
      <div class="col col-md-6 col-xl-4">
        <nb-card class="scrollable">
          <nb-card-header>{{title}}</nb-card-header>
          <nb-card-body *ngIf="controls.length > 0">
            <control-container [form]="group" [controls]="controls" #containerComponent></control-container>
          </nb-card-body>
          <nb-card-footer class="d-flex justify-content-between">
            <button nbButton status="basic" (click)="cancel()">取消</button>
            <button nbButton status="primary" [disabled]="group.invalid" (click)="save()">保存</button>
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
  standalone: false
})
export class GroupControlDialogComponent implements OnInit {
  @ViewChild('containerComponent') containerComponent!: ControlContainerComponent;
  controls: Control[] = [];
  title: string = "";
  group!: FormGroup<Record<string, AbstractControl<any, any>>>;

  constructor(private dialogRef: NbDialogRef<GroupControlDialogComponent>) {
  }

  ngOnInit(): void {
  }


  cancel() {
    this.dialogRef.close('cancel');
  }

  save() {
    this.dialogRef.close('save');
  }
}
