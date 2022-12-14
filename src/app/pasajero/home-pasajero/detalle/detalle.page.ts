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

  ngAfterViewInit(): void {

    const opciones = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(async (position) => {

        await this.cargarMapa(position);
        this.cargarAutocomplete();

      }, null, opciones);


    } else {
      console.log("navegador no compatible")
    }

  };


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

    //calcular ruta
    mapRuta() {

      const directionService = new google.maps.DirectionsService();
      const directionRender = new google.maps.DirectionsRenderer();
  
      directionRender.setMap(this.mapa);
  
      directionService.route({
  
        origin: 'Duoc puente alto',
        destination:  this.mapa.getCenter(),
        travelMode: google.maps.TravelMode.DRIVING
  
      }, resultado => {
        console.log(resultado);
        directionRender.setDirections(resultado);
  
        this.distancia = resultado.routes[0].legs[0].distance.text;
  
      });
  
    }
  
    private cargarAutocomplete() {
  
      const autocomplete = new google.maps.places.Autocomplete(this.renderer.selectRootElement(this.inputPlaces.nativeElement), {
        componentRestrictions: {
          country: ["CL"]
        },
        fields: ["address_components", "geometry"],
        types: ["address"],
      })
  
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
  
        const place: any = autocomplete.getPlace();
        console.log("el place completo es:", place)
         
        this.mapa.setCenter(place.geometry.location);
        const marker = new google.maps.Marker({
          position: place.geometry.location
        });
  
        marker.setMap(this.mapa);
        this.llenarFormulario(place);
      })
    }
  
    llenarFormulario(place: any) {
  
      const addressNameFormat: any = {
        'street_number': 'short_name',
        'route': 'long_name',
        'administrative_area_level_1': 'short_name',
        'administrative_area_level_2': 'short_name',
        'administrative_area_level_3': 'short_name',
        'country': 'long_name',
  
      };
  
      const getAddressComp = (type: any) => {
        for (const component of place.address_components) {
          if (component.types[0] === type) {
  
            return component[addressNameFormat[type]];
          }
        }
        return ' '
      };
  
      const componentForm = {
        direccion: 'location',
        ciudad: "administrative_area_level_3",
        provincia: 'administrative_area_level_2',
        region: 'administrative_area_level_1'
      };
  
      Object.entries(componentForm).forEach(entry => {
        const [key, value] = entry;
  
        this.formMapas.controls[key].setValue(getAddressComp(value))
      });
  
      this.formMapas.controls['direccion'].setValue(getAddressComp('route') + ' ' + getAddressComp('street_number'))
    };
  
    cargarMapa(position: any): any {
  
      const opciones = {
        center: new google.maps.LatLng(-33.598510621113626, -70.57907100242673),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  
      this.mapa = new google.maps.Map(this.renderer.selectRootElement(this.divMap.nativeElement), opciones)
  
      const markerPosition = new google.maps.Marker({
        position: this.mapa.getCenter(),
        title: "David",
      });
  
      markerPosition.setMap(this.mapa);
      this.markers.push(markerPosition);
    };

}
