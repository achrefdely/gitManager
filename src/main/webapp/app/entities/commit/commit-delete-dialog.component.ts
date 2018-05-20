import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Commit } from './commit.model';
import { CommitPopupService } from './commit-popup.service';
import { CommitService } from './commit.service';

@Component({
    selector: 'jhi-commit-delete-dialog',
    templateUrl: './commit-delete-dialog.component.html'
})
export class CommitDeleteDialogComponent {

    commit: Commit;

    constructor(
        private commitService: CommitService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.commitService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'commitListModification',
                content: 'Deleted an commit'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-commit-delete-popup',
    template: ''
})
export class CommitDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private commitPopupService: CommitPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.commitPopupService
                .open(CommitDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
