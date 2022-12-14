import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarUbicacionPageRoutingModule } from './buscar-ubicacion-routing.module';

import { BuscarUbicacionPage } from './buscar-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarUbicacionPageRoutingModule
  ],
  declarations: [BuscarUbicacionPage]
})
export class BuscarUbicacionPageModule {}
