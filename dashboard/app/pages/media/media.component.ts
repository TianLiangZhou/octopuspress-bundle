import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CKFinderService} from "../../@core/services/ckfinder.service";

@Component({
  selector: 'app-media',
  template: `
    <div class="row">
      <div class="col-md-12">
        <nb-card class="inline-form-card">
          <nb-card-body id="ckfinder-widget">
          </nb-card-body>
        </nb-card>
      </div>
    </div>
  `
})
export class MediaComponent implements OnInit, AfterViewInit {

  constructor(public ckfinder: CKFinderService) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    let build = false;
    let intervalId = setInterval(() => {
      if (window["CKFinder"] && build) {
        clearInterval(intervalId);
        return ;
      }
      this.ckfinder.widget('ckfinder-widget');
      build = true;
    }, 500);
  }
}
