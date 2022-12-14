import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './component/mapa/mapa.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home-conductor',
    loadChildren: () => import('./conductor/home-conductor/home-conductor.module').then( m => m.HomeConductorPageModule)
  },
  {
    path: 'perfil-conductor',
    loadChildren: () => import('./conductor/perfil-conductor/perfil-conductor.module').then( m => m.PerfilConductorPageModule)
  },
  {
    
    path: 'home-pasajero',
    children:[
      {
        path: '',
        loadChildren: () => import('./pasajero/home-pasajero/home-pasajero.module').then( m => m.HomePasajeroPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pasajero/home-pasajero/detalle/detalle.module').then( m => m.DetallePageModule)
      },
    ]
    
  },
  {
    path: 'perfil-pasajero',
    loadChildren: () => import('./pasajero/perfil-pasajero/perfil-pasajero.module').then( m => m.PerfilPasajeroPageModule)
  },
  {
    path: 'buscar-ubicacion',
    loadChildren: () => import('./pasajero/buscar-ubicacion/buscar-ubicacion.module').then( m => m.BuscarUbicacionPageModule)
  },
  {
    path: 'buscarpasajero',
    loadChildren: () => import('./conductor/buscarpasajero/buscarpasajero.module').then( m => m.BuscarpasajeroPageModule)
  },
  { 
    path: 'tipousuario',
    loadChildren: () => import('./tipousuario/tipousuario.module').then( m => m.TipousuarioPageModule)
  },
  {
    path: 'mapa', component : MapaComponent
  },
  {
    path: 'qrcode',
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'userslist',
    loadChildren: () => import('./api/userslist/userslist.module').then( m => m.UserslistPageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./api/profile/profile.module').then( m => m.ProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
