import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {OnSpinner, SiteOption} from "../../../../@core/definition/common";
import {map} from "rxjs/operators";
import {HttpClient, HttpContext} from "@angular/common/http";
import {SITE_BASIC_SAVE, SITE_BASIC} from "../../../../@core/definition/system/api";
import {SPINNER} from "../../../../@core/interceptor/authorization";

@Component({
  selector: 'app-site-general',
  templateUrl: './general.component.html',
})
export class GeneralComponent implements OnInit, OnSpinner {

  option: Record<string, any> = {};
  timezone: string[] = [];
  filteredOptions$: Observable<string[]> | undefined;
  @ViewChild('autoInput') input: ElementRef | undefined;
  submitted: boolean = false;
  constructor(private readonly http: HttpClient,) { }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  ngOnInit(): void {
    this.http.get<SiteOption>(SITE_BASIC).subscribe(res => {
        this.timezone = res.timezone;
        this.option = res.option;
        this.filteredOptions$ = of(res.timezone)
    });
  }
  action($event: any) {
    this.http.post(SITE_BASIC_SAVE, this.option, {context: new HttpContext().set(SPINNER, this) }).subscribe();
  }

  private filter(value: string): string[] {
    if (value === undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.timezone.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onChange() {
    this.filteredOptions$ = this.getFilteredOptions(this.input?.nativeElement.value);
  }

  onSelectionChange($event: any) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }
}
