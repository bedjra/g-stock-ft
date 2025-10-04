import { Routes } from '@angular/router';
import { Log } from './log/log';
import { DashboardComponent } from './all/dashboard/dashboard.component';
import { BaseComponent } from './COMPOSANTS/base/base.component';
import { Parametres } from './all/parametres/parametres';
import { Pdv } from './all/pdv/pdv';
import { Reappro } from './all/reappro/reappro';
import { ProduitComponent } from './all/produit/produit';
import { Detail } from './all/detail/detail';
import { Profil } from './all/profil/profil';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Log },
    {
        path: '',
        component: BaseComponent,

        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'pdv', component: Pdv },
            { path: 'reappro', component: Reappro },
            { path: 'produit', component: ProduitComponent },
            { path: 'parametre', component: Parametres },
            { path: 'detail', component: Detail },
            { path: 'profil', component: Profil },

        ],
    },
];
