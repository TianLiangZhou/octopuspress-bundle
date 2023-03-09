import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, ExtraOptions, TitleStrategy, RouterStateSnapshot} from '@angular/router';
import {AuthGuard} from "./@core/services/auth.guard";
import {NotFoundComponent} from "./not-found.component";
import {Title} from "@angular/platform-browser";
import {ConfigurationService} from "./@core/services/configuration.service";

const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {path: '', redirectTo: 'app', pathMatch: 'full'},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '404'},
];

const config: ExtraOptions = {
  useHash: true,
};


@Injectable({providedIn: 'root'})
export class OctopusTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title, protected config: ConfigurationService) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      let siteTitle = this.config.value('name');
      this.title.setTitle(`${title} - ${siteTitle}`);
    }
  }
}
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [
    {provide: TitleStrategy, useClass: OctopusTitleStrategy}
  ]
})
export class AppRoutingModule {
}
