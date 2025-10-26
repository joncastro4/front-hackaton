import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { InicioSesion } from './components/inicio-sesion/inicio-sesion';
import { Registro } from './components/registro/registro';
import { Dashboard } from './components/dashboard/dashboard';
import { InicioComponent } from './components/dashboard/inicio/inicio';
import { Compras } from './components/dashboard/compras/compras';
import { CrearCuenta } from './components/crear-cuenta/crear-cuenta';
import { ArgegarCompra } from './components/dashboard/compras/argegar-compra/argegar-compra';
import { authGuard } from './guards/auth-guard';
import { logInGuard } from './guards/log-in-guard';

export const routes: Routes = [
    { path: "", component: Landing },
    { path: "iniciar-sesion", component: InicioSesion, canActivate: [logInGuard] },
    { path: "registro", component: Registro, canActivate: [logInGuard] },
    { path: "crear-cuenta", component: CrearCuenta },
    { path: "dashboard", component: Dashboard, children: [
        { path: "inicio", component: InicioComponent },
        { path: "compras", component: Compras },
        {path: "agregar-compra", component: ArgegarCompra }
    ],
    canActivate: [authGuard]
    }
];