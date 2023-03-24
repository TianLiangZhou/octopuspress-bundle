import {EventEmitter, Injectable} from "@angular/core";
import {DynamicResourceLoaderService} from "./dynamic-resource-loader.service";
import {CookieService} from "ngx-cookie-service";

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
  private finderFileChoose = new EventEmitter<File[]>();

  private selectedFiles: Record<number, string> = {};

  constructor(private dynamicResourceLoader: DynamicResourceLoaderService,
              private cookieService: CookieService) {
    if (window.CKFinder == undefined) {
      this.dynamicResourceLoader.loadCKFinder();
    }
  }

  subscribe(func: (files: File[]) => void) {
    this.finderFileChoose.subscribe(func);
  }

  public getAttachmentUrl(id: number) {
    return this.selectedFiles.hasOwnProperty(id) ? this.selectedFiles[id] : "";
  }

  public addAttachmentUrl(id: number, url: string) {
    this.selectedFiles[id] = url;
  }

  popup(config: CKFinderPopupArgument) {
    const _this = this;
    const options = this.getOptions(window.outerWidth * 0.8)
    options.resourceType = config.resourceType;
    options.selectMultiple = config.multi ?? false;
    options.chooseFilesClosePopup = !config.cropped;
    options.onInit = function (finder: any) {
      if (config.cropped) {
        finder.on('crop:image:confirm', function (evt: any) {
          const file = evt.data.file;
          _this.finderFileChoose.emit([{
            id: file.get('id') ?? 0,
            source: config.source ?? '',
            name: file.name,
            url: file.getUrl(),
            size: file.size,
            extension: file.getExtension(),
          }]);
          _this.selectedFiles[file.get('id') ?? 0] = file.getUrl();
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
          _this.selectedFiles[item.get('id') ?? 0] = item.getUrl();
        });
        _this.finderFileChoose.emit(files);
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
      options.themeCSS = "/ckfinder/libs/custom.jquery.mobile.dark.min.css";
    }
    return options;
  }

}
