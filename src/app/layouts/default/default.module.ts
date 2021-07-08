import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { NextcloudComponent } from 'src/app/modules/nextcloud/nextcloud.component';
import { SynologyComponent } from 'src/app/modules/synology/synology.component';


@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    NextcloudComponent,
    SynologyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule
  ]
})
export class DefaultModule { }
