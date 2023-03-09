import {Injectable} from "@angular/core";
import {BehaviorSubject, share, Subject} from "rxjs";

@Injectable()
export class SharedService {
  private _isLoading = new BehaviorSubject<boolean>(false);

  isLoading = this._isLoading.asObservable();
  loading(loading: boolean) {
    this._isLoading.next(loading);
  }
}
