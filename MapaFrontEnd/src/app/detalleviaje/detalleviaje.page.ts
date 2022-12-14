import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from '../conductor/viaje';
import { FirebaseService } from '../services/firebase.service';
import { Pasajero } from '../pasajero/home-pasajero/pasajero';

@Component({
  selector: 'app-detalleviaje',
  templateUrl: './detalleviaje.page.html',
  styleUrls: ['./detalleviaje.page.scss'],
})
export class DetalleviajePage implements OnInit {
  
  constructor(private fire : FirebaseService, private database: AngularFirestore , private activaterouted : ActivatedRoute) {
    this.activaterouted.paramMap.subscribe(data => {
      this.id = data.get('id')
      console.log("iddd : ",this.id)

    })
  }
  id = '' 
  viaje = []
  viaje_pasajero = []
  pasajero : Pasajero = {
    id :'',
    id_viaje : '' ,
    nombre : '' ,
    inicio_viaje : '' 
  }
  ngOnInit() {
    this.id
    this.obtenerViajes()
    this.obtenerPasajeros()
  }
  

  obtenerViajes() {
    this.fire.getCollection<Viaje>('viajes').subscribe(
      (res) => {
        this.viaje = res;
        console.log(res)
      },
      (err) => {

      }
    )
  }
  guardarpasajeros(){
    this.fire.createDoc(this.pasajero,'pasajero',this.pasajero.id)
    this.database.doc('pasajero/${this.pasajero.id}').update({
    id_viaje : this.id,
    nombre : 'Nicolas' ,
    inicio_viaje : 'Duoc Uc Puente Alto'
    })
  }

  obtenerPasajeros (){
    this.fire.getCollection<Pasajero>('pasajero').subscribe(
      (resp) => {
        this.viaje_pasajero = resp ;
      },
      (err) =>{

      }
    )
  }
  
  agregarPasajero(){
    const id = this.fire.getId();
    this.pasajero.id = id ;
    this.guardarpasajeros();
  }


}
