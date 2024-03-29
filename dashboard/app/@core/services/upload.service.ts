import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {UPLOAD_FILE} from "../definition/open/api";

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {

  }

  // file from event.target.files[0]
  upload(files: Set<File>): { [p: string]: { progress: Observable<number>, response: Observable<any> } } {

    const status: { [key: string]: { progress: Observable<number>, response: Observable<any> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', UPLOAD_FILE, formData, {
        responseType: 'json',
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      const response = new Subject<any>();

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(
      {
          next(event) {
            if (event.type === HttpEventType.UploadProgress) {
              // calculate the progress percentage
              const percentDone = Math.round((100 * event.loaded) / event.total!);
              // pass the percentage into the progress-stream
              progress.next(percentDone);
            } else if (event instanceof HttpResponse) {
              // Close the progress-stream if we get an answer form the API
              // The upload is complete
              response.next(event.body);
              progress.complete();
            }
          },
          error(error) {
            response.next(error);
            progress.complete();
          }
        }
      );
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        response: response,
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
