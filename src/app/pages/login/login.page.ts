import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  constructor(public navCntrl: NavController, private auth: Auth) {}

  async login() {
    const user = await signInWithEmailAndPassword(
      this.auth,
      this.email,
      this.password
    );
    console.log(user);
    return user;
  }

  gotoSignup() {
    this.navCntrl.navigateForward('signup');
  }



  ngOnInit() {
  }

}
