import {Inject, Injectable} from "@angular/core";
import {DynamicResourceLoaderService} from "./dynamic-resource-loader.service";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, firstValueFrom, of, tap,} from "rxjs";
import { APP_BASE_HREF } from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {POST_ATTACHMENT_SHOW} from "../definition/content/api";
import {Attachment} from "../definition/content/type";
import {map} from "rxjs/operators";

export declare type CKFinderPopupArgument = {
  resourceType: string;
  element?: string;
  multi?: boolean;
  source?: string;
  cropped?: {width: number, height: number};
}

export declare type File = {
  id: number;
  name: string;
  url: string;
  size: number;
  extension: string;
  source: string;
}

@Injectable()
export class CKFinderService {
  private finderFileChoose = new BehaviorSubject<File[]>([]);

  private registeredFiles: Record<number, string> = {};

  constructor(@Inject(APP_BASE_HREF) private baseHref:string,
              private dynamicResourceLoader: DynamicResourceLoaderService,
              private cookieService: CookieService,
              private http: HttpClient,
  ) {
    if (window.CKFinder == undefined) {
      this.dynamicResourceLoader.loadCKFinder(baseHref + 'ckfinder/ckfinder.js');
    }
  }

  onChoose() {
    return this.finderFileChoose.pipe();
  }

  public getAttachmentUrl(id: number) {
    if (!this.registeredFiles.hasOwnProperty(id)) {
      return this.getMedia(id).pipe(map(res => {return res.url}));
    } else {
      return of(this.registeredFiles[id] ?? '');
    }
  }

  public addAttachmentUrl(id: number, url: string) {
    this.registeredFiles[id] = url;
  }

  public getMedia(id: number) {
    return this.http.get<Attachment>(POST_ATTACHMENT_SHOW, {params: {id: id}}).pipe(
      tap(res => {this.addAttachmentUrl(res.id, res.url)})
    );
  }


  popup(config: CKFinderPopupArgument) {
    const _this = this;
    const options = this.getOptions(window.outerWidth * 0.8)
    options.resourceType = config.resourceType;
    options.selectMultiple = config.multi ?? false;
    options.chooseFilesClosePopup = !config.cropped;
    options.onInit = function (finder: any) {
      finder.on('folder:getFiles:after', function (evt: any) {
        let collection = finder.request( 'files:getCurrent' );
        if (collection.length < 1) {
          return ;
        }
        collection.forEach((item: any) => {
          if (item.getUrl()) {
            _this.registeredFiles[item.get('id') ?? '0'] = item.getUrl();
          }
        });
      });
      if (config.cropped) {
        finder.on('crop:image:confirm', function (evt: any) {
          const file = evt.data.file;
          _this.finderFileChoose.next([{
            id: file.get('id') ?? 0,
            source: config.source ?? '',
            name: file.name,
            url: file.getUrl(),
            size: file.size,
            extension: file.getExtension(),
          }]);
          document.dispatchEvent(new MouseEvent('click'));
          if (config.element) {
            (<HTMLInputElement>document.getElementById(config.element)).value = evt.data.files.last().getUrl();
          }
        });
      }
      finder.on('files:choose', function (evt: any) {
        if (config.cropped) {
          finder.request('image:crop', {file: evt.data.files.first(), width: config.cropped.width, height: config.cropped.height});
          return ;
        }
        const files: File[] = [];
        evt.data.files.forEach((item: any) => {
          files.push({
            id: item.get('id') ?? 0,
            source: config.source ?? '',
            name: item.name,
            url: item.getUrl(),
            size: item.size,
            extension: item.getExtension(),
          });
        });
        _this.finderFileChoose.next(files);
        document.dispatchEvent(new MouseEvent('click'));
        if (config.element) {
          (<HTMLInputElement>document.getElementById(config.element)).value = evt.data.files.last().getUrl();
        }
      });
    }
    window.CKFinder.modal(options);
  }

  widget(container: string) {
    const options = this.getOptions('100%');
    window.CKFinder.widget(container, options);
  }

  private getOptions(width: any) {
    let options: Record<string, any> = {
      width: width,
      height: window.outerHeight * 0.8,
      language: 'zh-cn',
      skin: "jquery-mobile",
      chooseFiles: true,
      rememberLastFolder: false,
      plugins: [
        'plugins/ImageCrop',
      ]
    }
    const theme = this.cookieService.get("theme");
    if (theme == "dark" || theme == "cosmic") {
      options.swatch = theme === "dark" ? "b" : "a";
      options.themeCSS = this.baseHref + "ckfinder/libs/custom.jquery.mobile.dark.min.css";
    }
    return options;
  }

}
