import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { Viaje } from 'src/app/conductor/viaje';
import { Usuario } from 'src/app/home/usuario';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home-pasajero',
  templateUrl: './home-pasajero.page.html',
  styleUrls: ['./home-pasajero.page.scss'],
})
export class HomePasajeroPage implements OnInit {

  constructor(private fire : FirebaseService , private router : Router, private alerta : AlertController ) { }
  viajess = []
  usuarios: any;
  ngOnInit() {
    this.validacion()

    
  }
  ionViewWillEnter(){
this.validacion()
  }
  async validacion() {
    this.fire.ObtenerUsuario().then(
      (resp) => {
        if(resp.emailVerified){
          this.obtenerViajes()
          this.obtenerUsuarioss()
          
          this.router.navigate(['/home-pasajero'])
        }else{
          Swal.fire({
            icon:'error',
            title:'Tienes que tener tu Email verificado ',
            heightAuto: false

        })
        this.router.navigate(['/home'])
        
      }
      }
    )
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




  obtenerViajes() {
    this.fire.getCollection<Viaje>('viajes').subscribe(
      (res) => {
        this.viajess = res;
        console.log(res)
      },
      (err) => {

      }
    )
  }
  
  async mensajerror() {
    const alert = await this.alerta.create({
      header :'ERROR',
      message :'Error en la validacion de correo',
      buttons:[
        {
          text:'cerrar',
          handler : () =>{
            this.router.navigate(['/home']);
          },

        },

      ],

    });
    await alert.present();
  }
  async cerrarsesion(){
    this.fire.logout();
    this.router.navigate(['/home']);
  }


}
