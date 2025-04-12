import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TaxonomySetting, TermTaxonomy} from "../../@core/definition/content/type";
import {HttpClient, HttpContext} from "@angular/common/http";
import {
  TAXONOMIES,
  TAXONOMY_SHOW,
  TAXONOMY_STORE,
  TAXONOMY_UPDATE
} from "../../@core/definition/content/api";
import {ActivatedRoute} from "@angular/router";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {buildFormGroup, Control, ControlOption} from "../control/type";
import {OnSpinner, Records} from "../../@core/definition/common";
import {FormControl, FormGroup} from "@angular/forms";
import {SPINNER} from "../../@core/interceptor/authorization";
import {LocationStrategy} from "@angular/common";

@Component({
  selector: 'app-taxonomy-create',
  template: `
    <nb-card>
      <nb-card-header>
        {{formGroup.controls['id'].value < 1 ? setting!.labels.addNewItem : setting!.labels.editItem}}
      </nb-card-header>
      <nb-card-body>
        <form (ngSubmit)="onSubmit($event)" [formGroup]="formGroup">
          <control-container [controls]="controls" [form]="formGroup"></control-container>
          <control-container [controls]="metaControls" [form]="metaGroup"></control-container>
          <div class="my-3  d-flex justify-content-between">
            <label class="label col-form-label"></label>
            <button
              type="submit"
              status="primary"
              size="small"
              [disabled]="formGroup.invalid || spinner"
              [nbSpinner]="spinner"
              nbButton>
              {{formGroup.controls['id'].value < 1 ? setting!.labels.addNewItem : '更新'}}
            </button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
  standalone: false
})
export class CreateTaxonomyComponent implements OnInit, OnSpinner, OnChanges {
  @Input() setting!: TaxonomySetting;
  @Output() create: EventEmitter<TermTaxonomy> = new EventEmitter<TermTaxonomy>();
  spinner: boolean = false;
  formGroup!: FormGroup;
  controls: Control[] = [];
  metaControls: Control[] = [];

  constructor(protected http: HttpClient,
              protected config: ConfigurationService,) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildForm();
  }

  ngOnInit(): void {

  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  private buildForm() {
    let elements: Control[] = [];
    if (this.setting.labels['nameField']) {
      elements.push({
        label: this.setting.labels['nameField'], required: true, id: "name", type: 'input', description: this.setting.labels['nameFieldDescription'],
      });
    }
    if (this.setting.labels['slugField']) {
      elements.push({
        label: this.setting.labels['slugField'], id: "slug", type: 'input', value: '', validators: [{key: "pattern", value: "^[a-z0-9]+(?:-[a-z0-9]+)*$"}], description: this.setting.labels['slugFieldDescription'],
      });
    }
    if (this.setting.labels['parentField'] && this.setting.hierarchical) {
      let options: ControlOption[] = [
        {label: "无", value: ''},
      ];
      elements.push({
        label: this.setting.labels['parentField'], id: "parent", required: false, type: "select", value: '', options: options, description: this.setting.labels['parentFieldDescription'],
      });
      this.http.get<Records<TermTaxonomy>>(TAXONOMIES.replace('{taxonomy}', this.setting.slug)).subscribe(data => {
        data.records.forEach(item => {
          let name = item.name;
          if (item.level != undefined && item.level > 0) {
            name = '--'.repeat(item.level) + item.name;
          }
          options.push({label: name, value: item.id!})
        });
      });
    }
    if (this.setting.labels['descField']) {
      elements.push({
        label: this.setting.labels['descField'], id: "description", type: 'textarea', value: '', description: this.setting.labels['descFieldDescription'], required: false,
      });
    }
    this.formGroup = new FormGroup<any>(buildFormGroup(elements));
    this.formGroup.addControl('id', new FormControl<number>(0));
    this.formGroup.addControl('taxonomy', new FormControl<string>(this.setting.slug));
    const metas = this.config.taxonomyMeta(this.setting.slug);
    const metaControls: Control[] = [];
    if (metas.length > 0) {
      metas.forEach(item => {
        if (item.showUi && item.isUpdated && item.control) {
          metaControls.push(item.control);
        }
      });
    }
    this.formGroup.addControl('meta',new FormGroup<any>(buildFormGroup(metaControls)));
    this.metaControls = metaControls;
    this.controls = elements;
  }



  onSubmit($event: any) {
    if (this.formGroup?.invalid) {
      return ;
    }
    const data = this.formGroup?.getRawValue();
    this.http.post<TermTaxonomy>(TAXONOMY_STORE.replace('{taxonomy}', this.setting.slug), data, {context:new HttpContext().set(SPINNER, this)}).subscribe(response => {
      this.formGroup?.reset();
      this.formGroup?.controls['taxonomy'].setValue(this.setting.slug);
      this.formGroup?.controls['parent']?.setValue('');
      this.create.emit(response);
    });
  }
  get metaGroup() {
    return this.formGroup?.controls['meta'] as FormGroup;
  }
}

@Component({
  selector: 'app-taxonomy-edit',
  template: `
    <nb-card>
      <nb-card-header>{{taxonomySetting ? taxonomySetting!.labels.editItem : ''}}</nb-card-header>
      <nb-card-body>
        <form *ngIf="formGroup" (ngSubmit)="onSubmit($event)" [formGroup]="formGroup!">
          <control-container direction="" [controls]="controls" [form]="formGroup!"></control-container>
          <control-container [controls]="metaControls" [form]="metaGroup"></control-container>
          <div class="my-3  d-flex justify-content-between">
            <label class="label col-form-label"></label>
            <button
              type="submit"
              status="primary"
              size="small"
              [disabled]="formGroup!.invalid || spinner"
              [nbSpinner]="spinner"
              nbButton>更新</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
  standalone: false
})
export class EditTaxonomyComponent implements OnInit, OnSpinner {
  formGroup: FormGroup | undefined;
  controls: Control[] = [];
  spinner: boolean = false;
  taxonomySetting: TaxonomySetting | undefined;
  metaControls: Control[] = [];
  constructor(protected http: HttpClient,
              protected route: ActivatedRoute,
              protected location: LocationStrategy,
              protected config: ConfigurationService
              ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      let id = parseInt(map.get('id') || '0', 10);
      if (id < 1) {
        this.location.back();
        return ;
      }
      this.http.get<TermTaxonomy>(TAXONOMY_SHOW, {params: {id: id}}).subscribe(response => {
        let taxonomies = this.config.taxonomies();
        let taxonomySetting = taxonomies[response.taxonomy];
        if (!taxonomySetting) {
          this.location.back();
          return ;
        }
        this.buildSetting(taxonomySetting, response);
      }, error => {
        this.location.back();
      });
    });
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  private buildSetting(setting: TaxonomySetting, termTaxonomy: TermTaxonomy) {
    if (!setting.visibility.showUi) {
      this.location.back();
      return ;
    }
    let elements: Control[] = [];
    if (setting.labels['nameField']) {
      elements.push({
        label: setting.labels['nameField'], required: true, value: termTaxonomy.name, id: "name", type: 'input', description: setting.labels['nameFieldDescription'],
      });
    }
    if (setting.labels['slugField']) {
      elements.push({
        label: setting.labels['slugField'], id: "slug", type: 'input', value: termTaxonomy.slug, validators: [{key: "pattern", value: "^[a-z0-9]+(?:-[a-z0-9]+)*$"}], description: setting.labels['slugFieldDescription'],
      });
    }
    if (setting.labels['parentField'] && setting.hierarchical) {
      let options: ControlOption[] = [
        {label: "无", value: ''},
      ];
      elements.push({
        label: setting.labels['parentField'], id: "parent", required: false, type: "select", value: termTaxonomy.parent || '', options: options, description: setting.labels['parentFieldDescription'],
      });
      this.http.get<Records<TermTaxonomy>>(TAXONOMIES.replace('{taxonomy}', termTaxonomy.taxonomy)).subscribe(response => {
        response.records.forEach(item => {
          let name = item.name;
          if (item.level != undefined && item.level > 0) {
            name = '--'.repeat(item.level) + item.name;
          }
          options.push({label: name, value: item.id!})
        });
      });
    }
    if (setting.labels['descField']) {
      elements.push({
        label: setting.labels['descField'], id: "description", type: 'textarea', value: termTaxonomy.description, description: setting.labels['descFieldDescription'], required: false,
      });
    }
    this.formGroup =  new FormGroup<any>(buildFormGroup(elements));
    this.formGroup.addControl('id', new FormControl<number>(termTaxonomy.id!));
    this.formGroup.addControl('taxonomy', new FormControl<string>(termTaxonomy.taxonomy));
    const metas = this.config.taxonomyMeta(termTaxonomy.taxonomy);
    const metaControls: Control[] = [];
    if (metas.length > 0) {
      metas.forEach(item => {
        if (item.showUi && item.isUpdated && item.control) {
          metaControls.push(item.control);
        }
      });
    }
    this.formGroup.addControl('meta', new FormGroup<any>(buildFormGroup(metaControls, termTaxonomy.meta)));
    this.controls = elements;
    this.metaControls = metaControls;
    this.taxonomySetting = setting;
  }

  get metaGroup() {
    return this.formGroup?.controls['meta'] as FormGroup;
  }

  onSubmit($event: Event) {
    if (this.formGroup?.invalid) {
      return ;
    }
    const data = this.formGroup?.getRawValue();
    this.http.post<TermTaxonomy>(TAXONOMY_UPDATE.replace('{taxonomy}', data.taxonomy), data, {context:new HttpContext().set(SPINNER, this)}).subscribe(response => {
      this.location.back();
    });
  }
}
