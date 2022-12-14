import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbicacionYchoferelegidoPage } from './ubicacion-ychoferelegido.page';

const routes: Routes = [
  {
    path: '',
    component: UbicacionYchoferelegidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbicacionYchoferelegidoPageRoutingModule {}
