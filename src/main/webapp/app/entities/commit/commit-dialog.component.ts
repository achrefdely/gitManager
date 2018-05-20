import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Commit } from './commit.model';
import { CommitPopupService } from './commit-popup.service';
import { CommitService } from './commit.service';

@Component({
    selector: 'jhi-commit-dialog',
    templateUrl: './commit-dialog.component.html'
})
export class CommitDialogComponent implements OnInit {

    commit: Commit;
    isSaving: boolean;
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private commitService: CommitService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.commit.id !== undefined) {
            this.subscribeToSaveResponse(
                this.commitService.update(this.commit));
        } else {
            this.subscribeToSaveResponse(
                this.commitService.create(this.commit));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Commit>>) {
        result.subscribe((res: HttpResponse<Commit>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Commit) {
        this.eventManager.broadcast({ name: 'commitListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-commit-popup',
    template: ''
})
export class CommitPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private commitPopupService: CommitPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.commitPopupService
                    .open(CommitDialogComponent as Component, params['id']);
            } else {
                this.commitPopupService
                    .open(CommitDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
