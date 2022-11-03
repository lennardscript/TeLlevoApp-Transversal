import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarpasajeroPage } from './buscarpasajero.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarpasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarpasajeroPageRoutingModule {}
