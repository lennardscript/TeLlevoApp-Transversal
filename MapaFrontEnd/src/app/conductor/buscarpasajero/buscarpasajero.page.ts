import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/home/usuario';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-buscarpasajero',
  templateUrl: './buscarpasajero.page.html',
  styleUrls: ['./buscarpasajero.page.scss'],
})
export class BuscarpasajeroPage implements OnInit {

  constructor( private fire : FirebaseService) { }
  usuarios : any ;
  ngOnInit() {
  }
  obtenerUsuarioss() {
    this.fire.getCollection<Usuario>('usuarios').subscribe(
      (res)=>{
        this.usuarios = res ;
        console.log(res)
      },
      (err)  => {
      }
    )
  }
}
