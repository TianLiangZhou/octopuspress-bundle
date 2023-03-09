import {Injectable} from '@angular/core';

interface Resource {
  name: string;
  src: string;
}

interface ResourceLoaderResult {
  resource: string;
  loaded: boolean;
  status: string;
  type?: string;
}

declare var document: any;

@Injectable()
export class DynamicResourceLoaderService {

  private resources: any = {};

  constructor() {
  }

  push(resources: Resource[]) {
    resources.forEach((resource) => {
      if (!this.resources[resource.name]) {
        this.resources[resource.name] = {
          loaded: false,
          src: resource.src,
        };
      }
    });
  }

  load(...resources: string[]):  Promise<ResourceLoaderResult[]> {
    const promises: Promise<ResourceLoaderResult>[] = [];
    resources.forEach((name) => promises.push(this.loadResource(name)));
    return Promise.all(promises);
  }

  loadAll(): Promise<ResourceLoaderResult[]> {
    const promises: Promise<ResourceLoaderResult>[] = [];
    for (const name in this.resources) {
      if (this.resources[name].loaded) {
        continue;
      }
      promises.push(this.loadResource(name))
    }
    return Promise.all(promises);
  }

  loadResource(name: string): Promise<ResourceLoaderResult> {
    return new Promise((resolve, reject) => {
      if (!this.resources[name].loaded) {
        let element = null;
        const ext = this.resources[name].src.substring(this.resources[name].src.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'js') {
          element = this.loadScript(this.resources[name].src);
        } else if (ext.toLowerCase() == 'css') {
          element = this.loadStyle(this.resources[name].src);
        }
        if (element) {
          element.onload = () => {
              this.resources[name].loaded = true;
              resolve({resource: name, loaded: true, status: 'Loaded', type: ext.toLowerCase()});
            };
          element.onerror = (error: any) => resolve({resource: name, loaded: false, status: 'Load error'});
          document.getElementsByTagName('head')[0].appendChild(element);
        }
      } else {
        resolve({resource: name, loaded: true, status: 'Already Loaded'});
      }
    });
  }

  loadCKFinder() {
    this.push([{name: 'ckfinder', src:'/ckfinder/ckfinder.js'},]);
    if (window.CKFinder == undefined) {
      this.load('ckfinder').then(r => {
        console.log("load success");
      });
    }
  }

  private loadScript(href: string): HTMLScriptElement  {
    // load script
    const script: HTMLScriptElement = document.createElement('script');
    script.type = 'text/javascript';
    script.src = href;
    return script;
  }

  private loadStyle(href: string): HTMLLinkElement {
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    return link;
  }
}
