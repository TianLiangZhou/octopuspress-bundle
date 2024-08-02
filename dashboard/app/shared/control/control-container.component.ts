import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {buildFormGroup, Control} from "./type";
import {DynamicResourceLoaderService} from "../../@core/services/dynamic-resource-loader.service";
import {ControlComponent} from "./control.component";
import {ReplaySubject, timer} from "rxjs";

@Component({
  selector: "control-container",
  template:
    `
      <control *ngFor="let control of controls" [hidden]="control.hidden"
               #controlComponent
               [control]="control"
               [direction]="direction"
               [form]="form">
      </control>
    `,
  styles: [
    `
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    `
  ],
})
export class ControlContainerComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() direction = 'column';
  @Input() controls: Control[] = [];
  @Input() form!: FormGroup;
  @ViewChildren('controlComponent') controlComponents: QueryList<ControlComponent> = new QueryList<ControlComponent>();

  private $resourceSubject = new ReplaySubject<Record<string, string[]>>(1)
  private $controlSubject = new ReplaySubject<Control[]>(1);


  constructor(
    private resourceLoader: DynamicResourceLoaderService,
  ) {
  }

  ngAfterViewInit(): void {
    this.$resourceSubject.subscribe(resources => {
      const waitResources: any[] = [];
      const nameMap: Record<string, string> = {};
      Object.keys(resources).forEach((id) => {
        resources[id].forEach((resource) => {
          const file = resource.substring(resource.lastIndexOf('/') + 1);
          const index = file.lastIndexOf('.');
          const filename = file.substring(0, index);
          waitResources.push({name: filename, src: resource});
          nameMap[filename] = id;
        });
      });
      console.log(resources, nameMap);
      this.resourceLoader.push(waitResources);
      this.resourceLoader.load(...waitResources.map<string>((item) => item.name)).then((results) => {
        console.log(results);
        results.forEach((result) => {
          if (!result.loaded || result.type == undefined || result.type != 'js') {
            return;
          }
          const fun: any = window[result.resource as any];
          if (fun !== undefined) {
            let controlComponent: ControlComponent | undefined;
            let depends: Record<string, ControlComponent | undefined> = {};
            console.log(nameMap, result.resource);
            if (nameMap[result.resource]) {
              controlComponent = this.controlComponents.find((control) => control.id == nameMap[result.resource]);
              const control = this.controls.find((control) => control.id == nameMap[result.resource]);
              if (control && control.depends && control.depends.length > 0) {
                control.depends.forEach(depend => {
                  depends[depend] = this.controlComponents.find(element => element.id == depend);
                });
              }
            }
            timer(500).subscribe(() => {
              try {
                const component = new fun(controlComponent);
                component.init(depends);
                if (controlComponent && controlComponent.id) {
                  console.log(controlComponent.id)
                  window[(controlComponent.id + 'Component') as any] = component;
                }
              } catch (e) {
                console.log(e);
              }
            });
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.$controlSubject.subscribe((controls: Control[]) => {
      if (this.form == undefined) {
        this.form = new FormGroup<any>(buildFormGroup(controls));
      }
      const resources: Record<string, string[]> = {};
      controls.forEach((control) => {
        if (Array.isArray(control.resources) && control.resources.length > 0) {
          resources[control.id] = control.resources;
        }
        if (control.depends && control.depends.length > 0) {
           this.onDepend(control);
        }
      });
      if (Object.keys(resources).length > 0) {
        this.$resourceSubject.next(resources);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['controls'].currentValue != changes['controls'].previousValue) {
      this.$controlSubject.next(changes['controls'].currentValue);
    }
  }

  onDepend(control: Control) {
    const depends = control.depends;
    if (depends == undefined || depends.length < 1) {
      return ;
    }
    for (let depend of depends) {
      if (depend.length < 2) {
        continue;
      }
      const dependId = depend[0];
      if (depend[1] === "d") { // 显示
        if (depend[2] !== undefined)  {
          control.hidden =  Array.isArray(depend[2])
            ? !depend[2].includes(this.form.controls[dependId].value)
            : this.form.controls[dependId].value !== depend[2];
        } else {
          control.hidden = !this.form.controls[dependId].value;
        }
        this.form.controls[dependId].valueChanges.subscribe(value => {
          if (depend[2] !== undefined) {
            control.hidden = Array.isArray(depend[2])
              ? !depend[2].includes(value)
              : value !== depend[2];
          } else {
            control.hidden = !value;
          }
        });
      } else if (depend[1] === "e") { // 互斥
        this.form.controls[control.id].valueChanges.subscribe((value: any) => {
          const options = {
            onlySelf: false,
            emitEvent: false,
            emitModelToViewChange: true,
            emitViewToModelChange: true,
          };
          switch (typeof value) {
            case "boolean":
              this.form.controls[dependId].setValue(false, options);
              break;
            case "number":
            case "bigint":
              this.form.controls[dependId].setValue(0, options);
              break;
            case "string":
              this.form.controls[dependId].setValue("", options);
              break;
            case "object":
              if (Array.isArray(value)) {
                this.form.controls[dependId].setValue([], options);
              } else {
                this.form.controls[dependId].setValue({}, options);
              }
              break;
            default:
              this.form.controls[dependId].setValue(null, options);
          }
        });
      }
    }
  }
}
