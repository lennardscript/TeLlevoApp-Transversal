import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarUbicacionPage } from './buscar-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarUbicacionPageRoutingModule {}
