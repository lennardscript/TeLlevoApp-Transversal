import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class RecuperarpassPage implements OnInit {

  constructor(private alerta:AlertController) { }

  ngOnInit() {
  }
  async alertabasica(){
    const miAlerta = await this.alerta.create({
      header: 'Alerta',
      message: 'Contraseña cambiada correctamente',
      buttons: ['OK'],

    });
    await miAlerta.present();
  }
}
