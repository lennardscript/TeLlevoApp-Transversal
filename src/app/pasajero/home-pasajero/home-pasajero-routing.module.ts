import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePasajeroPage } from './home-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: HomePasajeroPage
  },
  {
    path: 'detalle',
    loadChildren: () => import('./detalle/detalle.module').then( m => m.DetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePasajeroPageRoutingModule {}
