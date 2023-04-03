import {
  AfterViewInit,
  Component,
  forwardRef, Inject,
  Input, LOCALE_ID,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {buildFormGroup, Control} from "./type";
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ControlComponent),
    multi: true
  }]
})
export class ControlComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {

  @Input() direction = 'column';
  @Input() control!: Control;
  @Input() form: FormGroup | undefined;
  invalid = false;
  protected onChange: Function = () => {};
  protected onTouched: Function = () => {};
  id: string = "";

  constructor(
    private ckfinder: CKFinderService,
    public dom: DomSanitizer,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngAfterViewInit(): void {

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
    this.ckfinder.onChoose().subscribe((files) => {
      if (!['file', 'image', 'video', 'audio'].includes(this.control.type)) {
        return ;
      }
      const attachments: Attachment[] = [];
      files.forEach((file) => {
        if (this.control.id == file.source) {
          attachments.push({url: file.url, id: file.id});
        }
      });
      if (attachments.length < 1) {
        return ;
      }
      // @ts-ignore
      this.control.attachment = this.control.multiple ? attachments : attachments[attachments.length - 1];
      const value = this.control.multiple ? attachments.map((item) => item.id) : attachments[attachments.length - 1].id;
      this.writeValue(value);
      this.getControl().setValue(value);
    });
  }

  removeMedia() {
    this.control.attachment = undefined;
    let value: undefined|any[] = [];
    if (!this.control.multiple) {
      value = undefined;
    }
    this.writeValue(value);
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

  ngOnChanges(changes: SimpleChanges): void {

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
      this.form = buildFormGroup([this.control])
    }
    return this.form.controls[this.control.id];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.control.disabled = isDisabled;
  }

  get value() {
    return this.control.value;
  }

  set value(value: any) {
    this.setValue(value);
    this.onChange(value);
  }

  private setValue(value: any) {
    this.writeValue(value);
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.control.value = value;
      this.onChange(this.value);
    }
  }
}
