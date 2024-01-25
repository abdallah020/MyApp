import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetStartPageRoutingModule } from './get-start-routing.module';

import { GetStartPage } from './get-start.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetStartPageRoutingModule
  ],
  declarations: [GetStartPage]
})
export class GetStartPageModule {}
