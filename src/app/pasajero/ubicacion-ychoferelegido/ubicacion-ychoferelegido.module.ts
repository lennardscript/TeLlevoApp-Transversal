import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbicacionYchoferelegidoPageRoutingModule } from './ubicacion-ychoferelegido-routing.module';

import { UbicacionYchoferelegidoPage } from './ubicacion-ychoferelegido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicacionYchoferelegidoPageRoutingModule
  ],
  declarations: [UbicacionYchoferelegidoPage]
})
export class UbicacionYchoferelegidoPageModule {}
