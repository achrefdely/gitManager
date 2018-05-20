import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { BranchComponent } from './branch.component';
import { BranchDetailComponent } from './branch-detail.component';
import { BranchPopupComponent } from './branch-dialog.component';
import { BranchDeletePopupComponent } from './branch-delete-dialog.component';

export const branchRoute: Routes = [
    {
        path: 'branch',
        component: BranchComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Branches'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'branch/:id',
        component: BranchDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Branches'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const branchPopupRoute: Routes = [
    {
        path: 'branch-new',
        component: BranchPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Branches'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'branch/:id/edit',
        component: BranchPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Branches'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'branch/:id/delete',
        component: BranchDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Branches'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
