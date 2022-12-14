import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../home/usuario';
import { FirebaseService } from '../services/firebase.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  user : Usuario = {
    id : '',
    tipo: '',
    nombre : '',
    pass: '',
    email: ''
    
  }
  constructor(private servicio : FirebaseService, private router : Router) { }
  
  ngOnInit() {
  }

  async guardar(){
    const credenciales = {
      email: this.user.email,
      password: this.user.pass,
      tipo : this.user.tipo
    }
    const res = await this.servicio.registrar(credenciales.email,credenciales.password)
    const uid = await this.servicio.getuid();
    this.user.id = uid;
    this.guardarUser();
    console.log(uid)
    this.router.navigate(['/home'])
    Swal.fire({
      icon:'success',
      title:'Registrado correctamente',
      heightAuto: false
  })


  }

  async guardarUser(){
    const path = 'usuarios';
    const name = this.user.nombre;
    
    this.servicio.createDoc(this.user,path,this.user.id)
    
  }

}
