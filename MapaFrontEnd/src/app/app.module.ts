import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {  ReactiveFormsModule  } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

import { MapaComponent } from './component/mapa/mapa.component';

@NgModule({
  declarations: [AppComponent,
    MapaComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, AngularFireModule.initializeApp
    (environment.firebaseConfig),AngularFireAuthModule,ReactiveFormsModule] ,
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
