import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarpasajeroPageRoutingModule } from './buscarpasajero-routing.module';

import { BuscarpasajeroPage } from './buscarpasajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarpasajeroPageRoutingModule
  ],
  declarations: [BuscarpasajeroPage]
})
export class BuscarpasajeroPageModule {}
