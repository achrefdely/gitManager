import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GitManagerSharedModule } from '../../shared';
import {
    RepoService,
    RepoPopupService,
    RepoComponent,
    RepoDetailComponent,
    RepoDialogComponent,
    RepoPopupComponent,
    RepoDeletePopupComponent,
    RepoDeleteDialogComponent,
    repoRoute,
    repoPopupRoute,
} from './';

const ENTITY_STATES = [
    ...repoRoute,
    ...repoPopupRoute,
];

@NgModule({
    imports: [
        GitManagerSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        RepoComponent,
        RepoDetailComponent,
        RepoDialogComponent,
        RepoDeleteDialogComponent,
        RepoPopupComponent,
        RepoDeletePopupComponent,
    ],
    entryComponents: [
        RepoComponent,
        RepoDialogComponent,
        RepoPopupComponent,
        RepoDeleteDialogComponent,
        RepoDeletePopupComponent,
    ],
    providers: [
        RepoService,
        RepoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitManagerRepoModule {}
