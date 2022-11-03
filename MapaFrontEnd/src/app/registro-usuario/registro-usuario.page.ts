import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  constructor( private servicio : FirebaseService,private router: Router, alertController: AlertController,private alerta:AlertController ) { }

  ngOnInit() {
  }
  async registrar (email,pass){
    const user = this.servicio.registrar(email.value,pass.value);
    if ( user ){
      Swal.fire({
        icon:'success',
        title:'Registrado correctamente',
        heightAuto: false
      })

    }
  }
}

