import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {  FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { MapaComponent } from './component/mapa/mapa.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpCliente: HttpClient) {
  return new TranslateHttpLoader(httpCliente, "../assets/i18n/",".json");
}
@NgModule({
  declarations: [AppComponent,
    MapaComponent],
  imports: [BrowserModule,IonicModule.forRoot(), 
    AppRoutingModule, AngularFireModule.initializeApp
    (environment.firebaseConfig),AngularFireAuthModule,ReactiveFormsModule,FormsModule,HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Geolocation ],
  bootstrap: [AppComponent],
})
export class AppModule {}


