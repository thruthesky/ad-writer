import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  id;
  password;
  constructor( public app: AppService ) { }

  ngOnInit() {

  }

  onSubmitLogin() {
    console.log("login");

    this.app.doLogin( this.id, this.password );

  }

}
