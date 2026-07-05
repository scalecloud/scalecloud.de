import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-imprint-page',
  templateUrl: './imprint-page.html',
  styleUrl: './imprint-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDivider, RouterLink],
})
export class ImprintPage {}