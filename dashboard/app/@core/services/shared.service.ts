import {Injectable} from "@angular/core";
import {BehaviorSubject, share, Subject} from "rxjs";

@Injectable()
export class SharedService {
  private _isLoading = new BehaviorSubject<boolean>(false);

  isLoading = this._isLoading.asObservable();

  private _lastPage: string = "";

  set lastPage(value: string) {
    this._lastPage = value;
  }
  get lastPage(): string {
    return this._lastPage;
  }
  loading(loading: boolean) {
    this._isLoading.next(loading);
  }
}
