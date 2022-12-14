import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { GoogleAuthProvider,GithubAuthProvider } from "firebase/auth";

import { userFire } from '../home/userfire';
import { Usuario } from '../home/usuario';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: AngularFireAuth, private database: AngularFirestore, private loading : LoadingController , private toastController : ToastController
    ,private router : Router) { }

    createDoc(data: any, path: string, id: string) {
      const collection = this.database.collection(path);
      return collection.doc(id).set(data);
    }
  
    getDoc<tipo>(path: string, id: string) {
      const collection = this.database.collection<tipo>(path);
      return collection.doc(id).valueChanges();
    }
  
    deleteDoc(path: string, id: string) {
      const collection = this.database.collection(path);
      return collection.doc(id).delete();
    }
  
    getId() {
      return this.database.createId();
    }
  
    getCollection<tipo>(path: string) {
      const collection = this.database.collection<tipo>(path);
      return collection.valueChanges();
    }

    idviaje(uid){
      const idviaje =  this.database.collection('viaje').get(uid)
      return idviaje
    }

    async getuid(){
      const user = await this.auth.currentUser
      if(user === null ){
        return null
      }else {
        return user.uid
      }


    }

    async mensaje(mensaje: string) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 1500,
        //position: 'top' | 'middle' | 'bottom'
      });
  
      await toast.present();
    }
  
    loadingAux: any;
  
    async cargarLoading(mensaje: string) {
      this.loadingAux = await this.loading.create({
        cssClass: 'my-custom-class',
        message: mensaje,
        //duration: 2000
      });
  
      await this.loadingAux.present();
    }
  
    async cerrarLoading() {
      await this.loadingAux.dismiss();
    }

  async logout(){
    await this.auth.signOut();
  }

  async login(Email : string, pass : string){
    const { user } = await this.auth.signInWithEmailAndPassword(Email ,pass);
    return user;
  }

  async registrar(Email : string, pass : string){
    const { user } = await this.auth.createUserWithEmailAndPassword(Email,pass);
    await this.verificacion();
    return user ;
  }


  async verificacion(){
    return (await this.auth.currentUser).sendEmailVerification();
  }

  async recuperar(correo : string){
    return this.auth.sendPasswordResetEmail(correo)
  }
  async ObtenerEmail(){
    return (await this.auth.currentUser).email;
  }

async ObtenerUsuario(){
    const aux : userFire = await this.auth.currentUser;
    return aux;
  }
  

  googleSignIn() {
    return this.auth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/home-conductor']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }
  GithubSignIn(){
    return this.auth.signInWithPopup(new GithubAuthProvider).then(res => {
      this.router.navigate(['/home-conductor']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }

}
