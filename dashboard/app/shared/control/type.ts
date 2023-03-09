import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Attachment} from "../../@core/definition/content/type";

export type ControlType = 'date' | 'input' | 'textarea' | 'file' | 'image' | 'video' | 'audio' | 'select' | 'checkbox' | 'radio' | 'datetime' | 'range_date' | 'autocomplete' | 'editor' | 'color' | 'combine' | 'switch' | 'custom';

export type InputType = 'text' | 'number' | 'email' | 'color' | 'password' | 'file' | 'url';

export type ControlOption = { label: string, value: string | number};

export type ControlValidator = { key: 'required' | 'min' | 'max' | 'pattern' | 'email', value: string | number };

export const buildFormGroup = function (controls: Control[], valueMap?: Record<string, any>) {
  const group: any = {};
  controls.forEach(element => {
    let value = (valueMap && valueMap.hasOwnProperty(element.id))
      ? valueMap[element.id]
      : (element.multiple ? (element.value || []) : element.value);
    const validators = [];
    if (element.required) {
      validators.push(Validators.required)
    }
    if (element.validators && element.validators.length > 0) {
      element.validators.forEach(validator => {
        switch (validator.key) {
          case "min":
            validators.push(Validators.min(+validator.value))
            break;
          case "max":
            validators.push(Validators.max(+validator.value))
            break;
          case "pattern":
            validators.push(Validators.pattern(validator.value.toString()))
            break;
          case "email":
            validators.push(Validators.email)
            break;
        }
      })
    }
    group[element.id] = new FormControl(value, validators);
  });
  return new FormGroup(group);
};

export type Control = {
  id: string;
  label: string;
  type: ControlType;
  placeholder?: string;
  inputType?: InputType;
  value?: any;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  options?: ControlOption[];
  validators?: ControlValidator[];
  disabled?: boolean,
  hidden?: boolean,
  format?: string,
  template?: string;
  settings?: Record<string, any>;
  children?: Control[];
  depends?: string[],
  resources?: string[],
  attachment?: Attachment[] | any,
  callback?: {
    create?: (control: AbstractControl, element: Control) => void,
    edit?: (control: AbstractControl, element: Control) => void,
  }
}
