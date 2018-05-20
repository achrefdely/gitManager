import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { RepoComponent } from './repo.component';
import { RepoDetailComponent } from './repo-detail.component';
import { RepoPopupComponent } from './repo-dialog.component';
import { RepoDeletePopupComponent } from './repo-delete-dialog.component';

export const repoRoute: Routes = [
    {
        path: 'repo',
        component: RepoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Repos'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'repo/:id',
        component: RepoDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Repos'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const repoPopupRoute: Routes = [
    {
        path: 'repo-new',
        component: RepoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Repos'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'repo/:id/edit',
        component: RepoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Repos'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'repo/:id/delete',
        component: RepoDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Repos'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
