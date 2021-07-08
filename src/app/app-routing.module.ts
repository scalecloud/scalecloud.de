import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { ContactComponent } from './modules/footer/contact/contact.component';
import { ImprintComponent } from './modules/footer/imprint/imprint.component';
import { LegalComponent } from './modules/footer/legal/legal.component';
import { PrivacyComponent } from './modules/footer/privacy/privacy.component';
import { HomeComponent } from './modules/main/home/home.component';
import { NextcloudComponent } from './modules/products/nextcloud/nextcloud.component';
import { SynologyComponent } from './modules/products/synology/synology.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [{
    path: '',
    component: HomeComponent
  }, {
    path: 'nextcloud',
    component: NextcloudComponent
  }, {
    path: 'synology',
    component: SynologyComponent
  }, {
    path: 'privacy',
    component: PrivacyComponent
  }, {
    path: 'imprint',
    component: ImprintComponent
  }, {
    path: 'legal',
    component: LegalComponent
  }, {
    path: 'contact',
    component: ContactComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
