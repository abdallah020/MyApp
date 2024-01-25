import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    CommonModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"fam-traiteur","appId":"1:977035262624:web:2d3ef86c4094a134ce27c5","storageBucket":"fam-traiteur.appspot.com","apiKey":"AIzaSyBcEczWrGQONyrI32oAJAZRBvkbbzjWBJM","authDomain":"fam-traiteur.firebaseapp.com","messagingSenderId":"977035262624","measurementId":"G-0T7YRJEX4B"})),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

const firebaseConfig = {
  apiKey: "AIzaSyBcEczWrGQONyrI32oAJAZRBvkbbzjWBJM",
  authDomain: "fam-traiteur.firebaseapp.com",
  projectId: "fam-traiteur",
  storageBucket: "fam-traiteur.appspot.com",
  messagingSenderId: "977035262624",
  appId: "1:977035262624:web:2d3ef86c4094a134ce27c5",
  measurementId: "G-0T7YRJEX4B"
};
