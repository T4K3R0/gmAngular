import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {

  menu: any = [
    {
      titulo: 'Dashboard',
      icono: 'material-icons',
      url: '/dashboard'
    },
    {
      titulo: 'Graficas',
      icono: 'material-icons',
      url: '/graficas1'
    },
    {
      titulo: 'Rxjs',
      icono: 'material-icons',
      url: '/rxjs'
    },
    {
      titulo: 'Promesas',
      icono: 'material-icons',
      url: '/promesas'
    },
    {
      titulo: 'Eventos',
      icono: 'material-icons',
      url: '/eventos'
    },
    {
      titulo: 'Usuarios',
      icono: 'material-icons',
      url: '/usuarios'
    },
    {
      titulo: 'Mensajes',
      icono: 'material-icons',
      url: '/mensajes'
    },
    {
      titulo: 'Portal',
      icono: 'material-icons',
      url: '/portal'
    },
    {
      titulo: 'Papelera',
      icono: 'material-icons',
      url: '/papelera'
    }
  ];

  constructor() { }

}