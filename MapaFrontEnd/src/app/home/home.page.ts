import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { TranslateService } from '@ngx-translate/core';


import Swal from 'sweetalert2';
import { userFire } from './userfire';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showPassword = false;
  usuario : any ;
  usuarios = []
  langs: string[] = [];
  constructor(private servicio : FirebaseService, private router : Router, private alerta : AlertController,private translateService: TranslateService) 
  
  {this.langs = this.translateService.getLangs();}

  ngOnInit(){
    
  }

  ionViewWillEnter(){
    
  }


  changeLang(event) {
    this.translateService.use(event.detail.value);
    console.log(event.detail.value)
  }
  async alertaV(){
    
    const alert = await this.alerta.create({
      
      header: 'Alert!',
      buttons: [
        {
          text: 'PASAJERO',
          handler: () => {
            this.router.navigate(['/home-pasajero'])
            Swal.fire({
              icon:'success',
              title:'ingresado correctamente',
              heightAuto: false
              
            })
          },
        },
        {
          text: 'CONDUCTOR',
          handler: () => {
            this.router.navigate(['/home-conductor'])
            Swal.fire({
              icon:'success',
              title:'ingresado correctamente',
              heightAuto: false
              
            })
          },
        },
      ],
    });

    await alert.present();
  }





  async login(txtEmail,txtPass){
    
    const user = this.servicio.login(txtEmail.value , txtPass.value).then(
      (resp) => {
        this.router.navigate(['/tipousuario'])
      },
      (err) => {
        Swal.fire({
          icon:'error',
          title:'Datos ingresado incorrectamente',
          heightAuto: false
      })
      }
    )
    
  }


    

  signInWithGoogle() {
    this.servicio.googleSignIn();
  }

  GitHubLogin() {
    this.servicio.GithubSignIn();
  }
  obtenerUsuarioss() {
    this.servicio.getCollection<userFire>('usuarios').subscribe(
      (res)=>{
        
        this.usuarios = res ;
        console.log(res)
      },
      (err)  => {
        
      }


    )
  }


  agregarUsuario(user: string, pass : string, tipo: string) {
    this.usuarios.push({
      user, pass, tipo, id: this.usuarios.length + 1 + ""
    })
  }

  eliminarUsuario(id: string) {
    this.usuarios = this.usuarios.filter(aux => {
      return aux.id !== id
    })
  }

  validacion(){
    this.servicio.ObtenerUsuario().then(
    (resp) =>{
      if (resp.emailVerified){
        this.obtenerUsuarioss();
        this.usuario = resp;
      } else {
        this.mensajerror();
      }
      
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

  async registraar (){
    const credenciales = {
      email: 'txtEmail'
    }
  }




}




