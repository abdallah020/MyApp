import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetStartPage } from './get-start.page';

const routes: Routes = [
  {
    path: '',
    component: GetStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetStartPageRoutingModule {}
