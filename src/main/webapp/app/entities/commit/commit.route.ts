import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CommitComponent } from './commit.component';
import { CommitDetailComponent } from './commit-detail.component';
import { CommitPopupComponent } from './commit-dialog.component';
import { CommitDeletePopupComponent } from './commit-delete-dialog.component';

export const commitRoute: Routes = [
    {
        path: 'commit',
        component: CommitComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commits'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'commit/:id',
        component: CommitDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commits'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const commitPopupRoute: Routes = [
    {
        path: 'commit-new',
        component: CommitPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commits'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'commit/:id/edit',
        component: CommitPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commits'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'commit/:id/delete',
        component: CommitDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commits'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
