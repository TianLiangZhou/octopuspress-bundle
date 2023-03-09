import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfiguration, Meta} from "../definition/common";
import {CONFIGURATION} from "../definition/open/api";
import {Observable, tap} from "rxjs";
import {PostTypeSetting, TaxonomySetting} from "../definition/content/type";

@Injectable()
export class ConfigurationService {
  private _config: Partial<AppConfiguration> = {};

  set config(config: Partial<AppConfiguration>) {
    this._config = config;
  }
  get config(): AppConfiguration {
    return <AppConfiguration>this._config;
  }

  value(key: string, defaultValue: any = null): any {
    // @ts-ignore
    return this._config[key] ?? defaultValue;
  }

  taxonomies(): Record<string, TaxonomySetting> {
    return this.config.taxonomies || {};
  }
  taxonomyMeta(taxonomy: string): Meta[] {
    return this.config.termMeta[taxonomy] || [];
  }

  postTypes(): Record<string, PostTypeSetting> {
    return this.config.postTypes || {};
  }
  postMeta(type: string): Meta[] {
    return this.config.postMeta[type] || [];
  }

  roles() {
    return this.config.roles || [];
  }

}

export function initializeAppFactory(http: HttpClient, configService: ConfigurationService): () => Observable<any> {
  return () => http.get<AppConfiguration>(CONFIGURATION).pipe(
    tap({
      error: (err) => configService.config = {},
      next: (res) => configService.config = res,
      finalize: () => {}
    })
  );

}
