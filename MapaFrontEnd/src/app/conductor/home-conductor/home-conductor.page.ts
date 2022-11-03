///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2'
import {  Viaje, } from '../viaje';
import { FormControl, FormGroup } from '@angular/forms'
import { ElementRef, ViewChild} from '@angular/core'


@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
})
export class HomeConductorPage implements OnInit {
  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;
  
  mapa!: google.maps.Map;
  markers: google.maps.Marker[];
  distancia!: string;
  formMapas!: FormGroup;

  viajes = []
  constructor(private renderer : Renderer2 , private servicio :  FirebaseService ,private router: Router, private alerta: AlertController) {
    this.markers = [];

    this.formMapas = new FormGroup({

      busqueda: new FormControl(''),
      direccion: new FormControl(''),
      referencia: new FormControl(''),
      ciudad: new FormControl(''),
      provincia: new FormControl(''),
      region: new FormControl('')
    })
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
  //calcular ruta
  mapRuta() {

    const directionService = new google.maps.DirectionsService();
    const directionRender = new google.maps.DirectionsRenderer();

    directionRender.setMap(this.mapa);

    directionService.route({

      origin: 'Quilpué, Chile',
      destination: 'Viña del Mar, Chile',
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
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
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



  onSubmit() {
    console.log("Datos del formulario: ", this.formMapas.value)
  };

  ngOnInit() {
    //this.personajes = this.servicio.obternerPersonajes()
    this.obtenerPersonajes();
  }

  // QUE FUNCIONA CADA VEZ QUE ENTRA A LA PAGINA
  ionViewWillEnter() {
    //this.personajes = this.servicio.obternerPersonajes()
    this.obtenerPersonajes();
  }

  obtenerPersonajes() {
    this.servicio.getCollection<Viaje>('viajes').subscribe(
      (res) => {
        this.viajes = res;
        console.log(res)
      },
      (err) => {

      }
    )
  }



  async agregar(txtnombre, txtinicio, txtFinal,txtPrecio) {
    this.servicio.ObtenerUsuario().then(
      (resp) => {
        if(resp.emailVerified){
            const per: Viaje = {
            id: this.servicio.getId(),
            nombre: txtnombre.value,
            inicio: txtinicio.value,
            final: txtFinal.value,
            precio: txtPrecio.value
          }

            this.servicio.cargarLoading("Almacenando viaje...")
            this.servicio.createDoc(per, 'viajes', per.id).then(
              (res) => {
                this.servicio.cerrarLoading()
                this.servicio.mensaje("Viaje creado!")
                this.router.navigate(['/buscarpasajero'])
              }
            )
          }
            
          else {
            Swal.fire({
              icon:'error',
              title:'Tienes que estar verificado para crear viajes',
              heightAuto: false
          })
          this.router.navigate(['/home'])
          }
        }
    )
    
  }
  async cerrarsesion(){
    this.servicio.logout();
    this.router.navigate(['/home']);
  }

  }
