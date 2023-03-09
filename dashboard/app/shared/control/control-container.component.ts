import {Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {buildFormGroup, Control} from "./type";
import {DynamicResourceLoaderService} from "../../@core/services/dynamic-resource-loader.service";
import {ControlComponent} from "./control.component";
import {ReplaySubject, Subject} from "rxjs";

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
export class ControlContainerComponent implements OnInit, OnChanges {
  @Input() direction = 'column';
  @Input() controls: Control[] = [];
  @Input() form!: FormGroup;
  @ViewChildren('controlComponent') controlComponents: QueryList<ControlComponent> = new QueryList<ControlComponent>();

  private $resourceSubject = new Subject<Record<string, string[]>>()
  private $controlSubject = new ReplaySubject<Control[]>(1);


  constructor(
    private resourceLoader: DynamicResourceLoaderService,
  ) {
  }

  ngOnInit(): void {
    this.$controlSubject.subscribe((controls: Control[]) => {
      if (this.form == undefined) {
        this.form = buildFormGroup(controls);
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
      this.resourceLoader.push(waitResources);
      this.resourceLoader.load(...waitResources.map<string>((item) => item.name)).then((results) => {
        results.forEach((result) => {
          if (!result.loaded || result.type == undefined || result.type != 'js') {
            return;
          }
          const fun: any = window[result.resource as any];
          if (fun !== undefined) {
            let controlComponent: ControlComponent | undefined;
            let depends: Record<string, ControlComponent | undefined> = {};
            if (nameMap[result.resource]) {
              controlComponent = this.controlComponents.find((control) => control.id == nameMap[result.resource]);
              const control = this.controls.find((control) => control.id == nameMap[result.resource]);
              if (control && control.depends && control.depends.length > 0) {
                control.depends.forEach(depend => {
                  depends[depend] = this.controlComponents.find(element => element.id == depend);
                });
              }
            }
            try {
              const component = new fun(controlComponent);
              component.init(depends);
            } catch (e) {
              console.log(e);
            }
          }
        });
      });
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
    let hidden = true;
    for (let depend of depends) {
      const dependMode = depend.split(":");
      if (dependMode.length < 2 || dependMode[1] === "d") {
        hidden = hidden && this.form.controls[depend].value;
      } else if (dependMode[1] === "e") {
        this.form.controls[control.id].valueChanges.subscribe((value: any) => {
          const type = typeof value;
          const options = {
            onlySelf: false,
            emitEvent: false,
            emitModelToViewChange: true,
            emitViewToModelChange: true,
          };
          switch (type) {
            case "boolean":
              this.form.controls[dependMode[0]].setValue(false, options);
              break;
            case "number":
            case "bigint":
              this.form.controls[dependMode[0]].setValue(0, options);
              break;
            case "string":
              this.form.controls[dependMode[0]].setValue("", options);
              break;
            default:
              this.form.controls[dependMode[0]].setValue(null, options);
          }
        });
      }
    }
    control.hidden = !hidden;
  }

}
