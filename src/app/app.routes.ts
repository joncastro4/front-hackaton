import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { InicioSesion } from './components/inicio-sesion/inicio-sesion';
import { Registro } from './components/registro/registro';
import { Dashboard } from './components/dashboard/dashboard';
import { Inicio } from './components/dashboard/inicio/inicio';
import { Compras } from './components/dashboard/compras/compras';

export const routes: Routes = [
    { path: "", component: Landing },
    { path: "iniciar-sesion", component: InicioSesion },
    { path: "registro", component: Registro },
    { path: "dashboard", component: Dashboard, children: [
        { path: "inicio", component: Inicio },
        { path: "compras", component: Compras }
    ]}
];