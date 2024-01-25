import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  nom: string = "";
  prenom: string = "";
  number: String = "";
  adresse: string = "";
  email: string = "";
  password: string = "";

  constructor(public navCntrl: NavController, private auth: Auth) { }

  ngOnInit() {
  }

   async signup() {
    const user = await createUserWithEmailAndPassword(
      this.auth,
      this.email,
      this.password
    );
    return user;
  }

  gotoLogin() {
    this.navCntrl.navigateBack('login');
  }

}
