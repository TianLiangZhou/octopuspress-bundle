import {
  Component,
  Inject,
  Input, LOCALE_ID,
  OnInit,
} from "@angular/core";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {buildFormGroup, Control} from "./type";
import {FormGroup} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {Attachment} from "../../@core/definition/content/type";

@Component({
  selector: "control",
  templateUrl: "control.component.html",
  styles: [
    `
      :host {
        width: 100%;
      }
    `
  ],
})
export class ControlComponent implements OnInit {

  @Input() direction = 'column';
  @Input() control!: Control;
  @Input() form: FormGroup | undefined;
  invalid = false;
  protected onChange: Function = () => {};
  protected onTouched: Function = () => {};
  id: string = "";
  attachments: string[] = [];

  constructor(
    private ckfinder: CKFinderService,
    public dom: DomSanitizer,
    @Inject(LOCALE_ID) private locale: string,
  ) {

  }

  ngOnInit() {
    this.id = this.control.id;
    if (!this.control.inputType) {
      this.control.inputType = 'text';
    }
    if (!this.control.placeholder) {
      this.control.placeholder = '';
    }
    if (!this.control.format) {
      this.control.format = '';
    }
    const formControl = this.getControl();
    if (this.control.disabled) {
      formControl?.disable();
    }
    formControl?.statusChanges.subscribe(res => {
      this.invalid = res == 'INVALID' && formControl.dirty;
    });
    if (['file', 'image', 'video', 'audio'].includes(this.control.type)) {
      this.ckfinder.onChoose().subscribe((files) => {
        const attachments: Attachment[] = [];
        files.forEach((file) => {
          if (this.control.id == file.source) {
            attachments.push({url: file.url, id: file.id});
          }
        });
        if (attachments.length < 1) {
          return ;
        }
        let value = null;
        if (this.control.multiple) {
          value = [];
          attachments.forEach(item => {
            value.push(item.id);
          });
        } else {
          let attachment = attachments.pop();
          value = attachment!.id;
        }
        formControl.setValue(value);
      });
      formControl.valueChanges.subscribe(values => {
        if (values) {
          this.buildAttachment(values);
        }
      });
      if (formControl.value) {
        this.buildAttachment(formControl.value)
      }
    }
  }

  private buildAttachment(value: any) {
    if (!Array.isArray(value)) {
      let number = parseInt(value, 10);
      if (number > 0) {
        this.ckfinder.getAttachmentUrl(number).subscribe(url => {
          this.attachments[0] = url;
        });
      }
    } else {
      value.forEach(number => {
        if (number < 1) {
          return ;
        }
        this.ckfinder.getAttachmentUrl(number).subscribe(url => {
          this.attachments.push(url);
        });
      });
    }
  }

  removeMedia() {
    this.attachments = [];
    let value: undefined|any[] = [];
    if (!this.control.multiple) {
      value = undefined;
    }
    this.getControl().setValue(value);
  }

  openMedia() {
    if (this.control.type == 'image') {
      this.ckfinder.popup({
        resourceType: "Images",
        multi: this.control.multiple!,
        source: this.control.id,
        cropped: this.control.settings && this.control.settings.cropped ? this.control.settings.cropped : undefined,
      });
    } else {
      const resourceType = this.control.type.charAt(0).toUpperCase() + this.control.type.slice(1) + 's';
      this.ckfinder.popup({resourceType: resourceType, multi: this.control.multiple!, source: this.control.id});
    }
  }

  get status() {
    const control = this.getControl();
    return control?.dirty ? (control.invalid ? 'danger' : 'success') : 'primary';
  }

  get error() {
    const error = this.getControl()?.errors;
    if (error == null || error.nbDatepickerParse) {
      return "";
    }
    if (error.required) {
      return this.control.label + "不能为空";
    }
    if (error.min) {
      return this.control.label + "最小为" + this.control.validators?.find(t => t.key == 'min')?.value;
    }
    if (error.max) {
      return this.control.label + "最大为" + this.control.validators?.find(t => t.key == 'max')?.value;
    }
    if (error.pattern) {
      return this.control.label + "格式不正确";
    }
    return "未知错误";
  }

  getControl() {
    if (this.control.required) {
      if (!this.control.placeholder) {
        this.control.placeholder = "必填项";
      }
    }
    if (this.form == undefined) {
      this.form = new FormGroup<any>(buildFormGroup([this.control]))
    }
    return this.form.controls[this.control.id];
  }


  get formGroup() {
    return this.getControl();
  }
}
