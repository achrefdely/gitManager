import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GitManagerSharedModule } from '../../shared';
import {
    CommitService,
    CommitPopupService,
    CommitComponent,
    CommitDetailComponent,
    CommitDialogComponent,
    CommitPopupComponent,
    CommitDeletePopupComponent,
    CommitDeleteDialogComponent,
    commitRoute,
    commitPopupRoute,
} from './';

const ENTITY_STATES = [
    ...commitRoute,
    ...commitPopupRoute,
];

@NgModule({
    imports: [
        GitManagerSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CommitComponent,
        CommitDetailComponent,
        CommitDialogComponent,
        CommitDeleteDialogComponent,
        CommitPopupComponent,
        CommitDeletePopupComponent,
    ],
    entryComponents: [
        CommitComponent,
        CommitDialogComponent,
        CommitPopupComponent,
        CommitDeleteDialogComponent,
        CommitDeletePopupComponent,
    ],
    providers: [
        CommitService,
        CommitPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitManagerCommitModule {}
