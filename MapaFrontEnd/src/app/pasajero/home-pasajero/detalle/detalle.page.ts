///<reference path="../../../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from 'src/app/conductor/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Pasajero } from '../pasajero';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  constructor(private fire : FirebaseService, private renderer: Renderer2,private database: AngularFirestore , private activaterouted : ActivatedRoute,private router: Router ) {
    this.activaterouted.paramMap.subscribe(data => {
      this.id = data.get('id')
      console.log("iddd : ",this.id)

    })
  }
  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;
  mapa!: google.maps.Map;
  markers: google.maps.Marker[];
  distancia!: string;
  formMapas!: FormGroup;
  


  id = '' 
  viajes : Viaje
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
    this.database.doc(`pasajero/${this.pasajero.id}`).update({
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
    const uid = this.fire.getId();
    this.pasajero.id = uid ;
    this.guardarpasajeros();
  }
  
  
  qrCodeString = 'Viaje Cerrado';
  scannedResult: any;
  content_visibility = '';


  // startScan() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     console.log('Barcode data', barcodeData);
  //     this.scannedResult = barcodeData?.text;
  //    }).catch(err => {
  //        console.log('Error', err);
  //    });
  // }
  
  
  cancelarViaje(){
    this.database.doc(`viajes/${this.id}`).update({
      estado : 'Viaje cancelado'
      
      })
  }


    
  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
    }
  }



  
  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        this.cancelarViaje();
        this.scannedResult = result.content;
        console.log(this.scannedResult);
          Swal.fire({
          icon:'success',
          title:'Viaje Finalizado correctamente',
          heightAuto: false
      })
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
  }
  
  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  ngOnDestroy(): void {
      this.stopScan();
  }

  async cerrarsesion(){
    this.fire.logout();
    this.router.navigate(['/home']);
  }

}
