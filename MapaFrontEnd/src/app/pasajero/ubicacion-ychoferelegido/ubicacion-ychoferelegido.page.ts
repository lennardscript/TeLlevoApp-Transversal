import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/conductor/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-ubicacion-ychoferelegido',
  templateUrl: './ubicacion-ychoferelegido.page.html',
  styleUrls: ['./ubicacion-ychoferelegido.page.scss'],
})
export class UbicacionYchoferelegidoPage implements OnInit {

  constructor(private fire : FirebaseService) { }
  viajes = []
  ngOnInit() {
  }
  obtenerViajes() {
    this.fire.getCollection<Viaje>('viajes').subscribe(
      (res) => {
        this.viajes = res;
        console.log(res)
      },
      (err) => {

      }
    )
  }
  
}
