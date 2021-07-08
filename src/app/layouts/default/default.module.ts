import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/main/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { NextcloudComponent } from 'src/app/modules/products/nextcloud/nextcloud.component';
import { SynologyComponent } from 'src/app/modules/products/synology/synology.component';
import { PrivacyComponent } from 'src/app/modules/footer/privacy/privacy.component';
import { ImprintComponent } from 'src/app/modules/footer/imprint/imprint.component';
import { LegalComponent } from 'src/app/modules/footer/legal/legal.component';
import { ContactComponent } from 'src/app/modules/footer/contact/contact.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    NextcloudComponent,
    SynologyComponent,
    PrivacyComponent,
    ImprintComponent,
    LegalComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule
  ]
})
export class DefaultModule { }
