import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GitManagerSharedModule } from '../../shared';
import {
    BranchService,
    BranchPopupService,
    BranchComponent,
    BranchDetailComponent,
    BranchDialogComponent,
    BranchPopupComponent,
    BranchDeletePopupComponent,
    BranchDeleteDialogComponent,
    branchRoute,
    branchPopupRoute,
} from './';

const ENTITY_STATES = [
    ...branchRoute,
    ...branchPopupRoute,
];

@NgModule({
    imports: [
        GitManagerSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BranchComponent,
        BranchDetailComponent,
        BranchDialogComponent,
        BranchDeleteDialogComponent,
        BranchPopupComponent,
        BranchDeletePopupComponent,
    ],
    entryComponents: [
        BranchComponent,
        BranchDialogComponent,
        BranchPopupComponent,
        BranchDeleteDialogComponent,
        BranchDeletePopupComponent,
    ],
    providers: [
        BranchService,
        BranchPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitManagerBranchModule {}
