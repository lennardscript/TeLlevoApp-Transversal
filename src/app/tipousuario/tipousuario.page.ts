import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tipousuario',
  templateUrl: './tipousuario.page.html',
  styleUrls: ['./tipousuario.page.scss'],
})
export class TipousuarioPage implements OnInit {

  constructor( private servicio : FirebaseService,private router : Router,private translateService: TranslateService) { }

  ngOnInit() {
  }


  changeLang(event) {
    this.translateService.use(event.detail.value);
    console.log(event.detail.value)
  }
  
  
}  


