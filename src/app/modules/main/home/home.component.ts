import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.snackBarService.errorDuration("This Website is currently under construction. Please come back later.", 30);
  }



}
