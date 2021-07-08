import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { NextcloudComponent } from './modules/nextcloud/nextcloud.component';
import { SynologyComponent } from './modules/synology/synology.component';

const routes: Routes = [ {
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
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
