import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Repo } from './repo.model';
import { RepoPopupService } from './repo-popup.service';
import { RepoService } from './repo.service';

@Component({
    selector: 'jhi-repo-delete-dialog',
    templateUrl: './repo-delete-dialog.component.html'
})
export class RepoDeleteDialogComponent {

    repo: Repo;

    constructor(
        private repoService: RepoService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.repoService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'repoListModification',
                content: 'Deleted an repo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-repo-delete-popup',
    template: ''
})
export class RepoDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private repoPopupService: RepoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.repoPopupService
                .open(RepoDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
