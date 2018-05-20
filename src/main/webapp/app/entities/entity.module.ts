import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GitManagerRepoModule } from './repo/repo.module';
import { GitManagerCommitModule } from './commit/commit.module';
import { GitManagerBranchModule } from './branch/branch.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        GitManagerRepoModule,
        GitManagerCommitModule,
        GitManagerBranchModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitManagerEntityModule {}
