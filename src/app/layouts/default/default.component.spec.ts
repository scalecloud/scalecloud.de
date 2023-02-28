import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultComponent } from './default.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule, MatLegacyNavList as MatNavList } from '@angular/material/legacy-list';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MatLegacyMenu as MatMenu, MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DefaultComponent,
        SidebarComponent,
        MatDivider,
        MatIcon,
        MatNavList,
        FooterComponent,
        MatDivider,
        HeaderComponent,
        MatMenu,
        MatToolbar,
        MatToolbarRow,
        MatIcon
      ],
      imports: [
        RouterTestingModule,
        MatListModule,
        MatMenuModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
