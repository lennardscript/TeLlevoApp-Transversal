import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-tipousuario',
  templateUrl: './tipousuario.page.html',
  styleUrls: ['./tipousuario.page.scss'],
})
export class TipousuarioPage implements OnInit {

  constructor( private servicio : FirebaseService,private router : Router) { }

  ngOnInit() {
  }



  
  
}  


