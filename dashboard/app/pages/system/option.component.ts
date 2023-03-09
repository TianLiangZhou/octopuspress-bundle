import {Component, OnInit, TemplateRef} from '@angular/core';
import {OPTION_STORE, OPTION_UPDATE, OPTIONS} from "../../@core/definition/system/api";
import {Option} from "../../@core/definition/system/type";
import {IColumnType, ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {NbWindowService, NbWindowState} from "@nebular/theme";
import {EditEvent} from "angular2-smart-table/lib/lib/events";

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
})
export class OptionComponent implements OnInit {

  settings = {};
  source: ServerDataSource | undefined;
  dataType = [
    {t: 1, n: '开关类型'},
    {t: 2, n: '数组类型'},
    {t: 3, n: '键值类型'},
    {t: 4, n: '数组键值类型'},
    {t: 5, n: '值类型'},
    {t: 6, n: '多行值类型'},
  ];
  constructor(protected http: HttpClient,
              protected windowService: NbWindowService) {
  }

  editable = false;
  formGroup = new FormGroup({
    'name': new FormControl<string>('', [Validators.required]),
    'type': new FormControl<number>(0,),
    'value1': new FormControl<boolean>(false),
    'value2': new FormArray<FormControl>([
      new FormControl<string>('')
    ]),
    'value3': new FormArray<FormGroup>([
      new FormGroup({
        key: new FormControl(''),
        value:new FormControl(''),
      })
    ]),
    'value4': new FormArray<FormArray>([
      new FormArray<FormGroup>([
        new FormGroup({
          key: new FormControl(''),
          value:new FormControl(''),
        })
      ])
    ]),
    'value5': new FormControl<string>(''),
  });


  createRow(i: number, j: number) {
    let type = this.formGroup.controls['type'].value;
    switch (type) {
      case 2:
        this.value2.push(new FormControl<string>(''));
        break;
      case 3:
        this.value3.push(
          new FormGroup({
            key: new FormControl(''),
            value:new FormControl(''),
          })
        )
        break;
      case 4:
        if (j === -1) {
          this.value4.push(
            new FormArray<FormGroup>([
              new FormGroup({
                key: new FormControl(''),
                value:new FormControl(''),
              })
            ])
          );
        } else {
          this.value4.controls[i].controls.push(
            new FormGroup({
              key: new FormControl(''),
              value:new FormControl(''),
            })
          );
        }
        break;
    }
  }

  deleteRow(i: number, j: number) {
    let type = this.formGroup.controls['type'].value;
    switch (type) {
      case 2:
        this.value2.removeAt(i);
        break;
      case 3:
        this.value3.removeAt(i);
        break;
      case 4:
        if (i > -1  &&  j < 0) {
          this.value4.removeAt(i);
        }
        if (i > -1  && j > -1) {
          this.value4.controls[i].removeAt(j);
        }
        break;
    }
  }

  ngOnInit(): void {
    this.settings = this.buildSettings()
    this.source = new ServerDataSource(this.http, {
      endPoint: OPTIONS,
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }

  onSubmit() {

  }

  create(tpl: TemplateRef<any>) {
    this.formGroup.reset();
    this.formGroup.controls['name'].enable()
    this.formGroup.controls['type'].enable()
    this.optionWindow(tpl);
  }

  edit(row: EditEvent, tpl: TemplateRef<any>) {
    let option: Option = row.data;
    this.bindFormControl(option);
    this.optionWindow(tpl);
  }

  get value2() {
    return this.formGroup.controls.value2 as FormArray<FormControl>;
  }

  get value3() {
    return this.formGroup.controls.value3 as FormArray<FormGroup>;
  }

  get value4() {
    return this.formGroup.controls.value4 as FormArray<FormArray<FormGroup>>;
  }


  private buildSettings(): Settings {
    return {
      selectMode: 'single',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
        columnTitle: '操作',
      },
      pager: {
        perPage: 30,
      },
      mode: 'external',
      rowClassFunction: () => {
        return 'text-break';
      },
      columns: {
        name: {
          title: '名称',
        },
        value: {
          title: '值',
          type: IColumnType.Html,
          valuePrepareFunction: (value: any) => {
            if (this.isArray(value)) {
              return `<pre>` + JSON.stringify(value, undefined, 2) + `</pre>`;
            }
            if (this.isObject(value)) {
              return `<pre>` + JSON.stringify(value, undefined, 2) + `</pre>`;
            }
            return value;
          },
          filter: false,
        }
      }
    }
  }


  private isArray(obj: any) {
    return Array.isArray(obj);
  }

  private isObject(obj: any) {
    return obj instanceof Object;
  }

  private bindFormControl(option: Option) {
    this.formGroup.controls['name'].disable()
    this.formGroup.controls['type'].disable()
    this.formGroup.controls['name'].setValue(option.name);
    this.formGroup.controls['type'].setValue(option.type);
    switch (option.type) {
      case 1:
        this.formGroup.controls["value1"].setValue(option.value == 'on' ? true : false);
        break;
      case 2:
        if (this.isArray(option.value)) {
          option.value.forEach((val: string, index: number) => {
            let formControl = this.value2.at(index);
            if (formControl) {
              formControl.setValue(val);
            } else {
              this.value2.push(new FormControl(val));
            }
          });
        }
        break;
      case 3:
        if (this.isObject(option.value)) {
          const keys = Object.keys(option.value);
          keys.forEach((key, index) => {
            let formGroup = this.value3.at(index);
            if (formGroup) {
              formGroup.setValue({
                key: key, value: option.value[key] || '',
              });
            } else {
              this.value3.push(new FormGroup({
                key: new FormControl(key),
                value:new FormControl(option.value[key] || ''),
              }));
            }
          });
        }
        break;
      case 4:
        if (this.isArray(option.value)) {
          option.value.forEach((item: any, index: number) => {
            if (!this.isObject(item)) {
              return ;
            }
            let formArray = this.value4.at(index);
            if (!formArray) {
              formArray = new FormArray<FormGroup>([]);
              this.value4.push(formArray);
            }
            const keys = Object.keys(item);
            keys.forEach((key, index) => {
              let formGroup = formArray.at(index);
              if (formGroup) {
                formGroup.setValue({
                  key: key, value: item[key] || '',
                });
              } else {
                formArray.push(new FormGroup({
                  key: new FormControl(key),
                  value:new FormControl(item[key] || ''),
                }));
              }
            });
          });
        }
        break;
      case 5:
      case 6:
        this.formGroup.controls.value5.setValue(option.value);
        break;
    }
  }

  private optionWindow(tpl: TemplateRef<any>) {
    this.windowService.open(tpl, {
      title: "",
      windowClass: 'col-lg-6',
      context: {},
      initialState: NbWindowState.FULL_SCREEN,
      hasBackdrop: true,
    })
  }
}
