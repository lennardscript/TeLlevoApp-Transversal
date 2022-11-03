import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
 
  
  API = "http://localhost:1337/api/viajes"

  constructor(private cliente: HttpClient) { }
  obtenerViaje(){
    return this.cliente.get("http://localhost:1337/api/viajes")
  }

  eliminarViaje(id: string){
    return this.cliente.delete(`${this.API}/${id}`)
    //si no funciona de esta manera colocar  ("http://localhost:1337/api/qrs%22+id)
  }

  obetenerSeccion(){
    return this.cliente.get("http://localhost:1337/api/viajes")
  }

  
}
