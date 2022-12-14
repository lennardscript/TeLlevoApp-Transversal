///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { ElementRef, ViewChild, Renderer2 } from '@angular/core'
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from 'src/app/conductor/viaje';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;

  mapa!: google.maps.Map;
  markers: google.maps.Marker[];
  distancia!: string;
  formMapas!: FormGroup;


  constructor(private translateService: TranslateService,private auth: AngularFireAuth,private renderer: Renderer2, private alerta : AlertController,private geolocation: Geolocation , private servicio : FirebaseService) {
    this.markers = [];

    this.formMapas = new FormGroup({

      busqueda: new FormControl(''),
      direccion: new FormControl(''),
      referencia: new FormControl(''),
      ciudad: new FormControl(''),
      provincia: new FormControl(''),
      region: new FormControl(''),
    })
  }

  ngOnInit(): void {
  }
  changeLang(event) {
    this.translateService.use(event.detail.value);
    console.log(event.detail.value)
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


async GUARDAR(txtConductor,txtprecio,txtHora) {
  const uid = await this.servicio.getuid();


  const per : Viaje = {
  uid :  this.servicio.getId(),
  conductor: txtConductor.value,
  pasajero: '',
  direccion: this.formMapas.value.direccion,
  precio: txtprecio.value,
  id_conductor : uid,
  hora : txtHora.value,
  estado : ''
  
} 
  Swal.fire({
  icon:'success',
  title:'Viaje creado correctamente',
  heightAuto: false
})
this.servicio.createDoc(per, 'viajes', per.uid)
  
}

  onSubmit() {
    console.log("Datos del formulario: ", this.formMapas.value.direccion)
  };

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