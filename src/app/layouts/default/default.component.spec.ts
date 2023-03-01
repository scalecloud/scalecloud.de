import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultComponent } from './default.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

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
