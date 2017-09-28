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

    const userRef = this.app.db.child('users').child(this.id);
    userRef.once('value', snap => {
      if ( snap.val() ) {
        const val = snap.val();
        if ( val['password'] === this.password ) {
          this.app.login = true;
          this.app.user.id = this.id;
        }
        else {
          alert("Wrong password");
        }
      }
      else {
        userRef.set({'password': this.password});
        this.app.login = true;
        this.app.user.id = this.id;
      }
    });


  }

}
