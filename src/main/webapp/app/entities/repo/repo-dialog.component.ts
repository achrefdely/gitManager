import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Repo } from './repo.model';
import { RepoPopupService } from './repo-popup.service';
import { RepoService } from './repo.service';

@Component({
    selector: 'jhi-repo-dialog',
    templateUrl: './repo-dialog.component.html'
})
export class RepoDialogComponent implements OnInit {

    repo: Repo;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private repoService: RepoService,
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
        if (this.repo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.repoService.update(this.repo));
        } else {
            this.subscribeToSaveResponse(
                this.repoService.create(this.repo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Repo>>) {
        result.subscribe((res: HttpResponse<Repo>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Repo) {
        this.eventManager.broadcast({ name: 'repoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-repo-popup',
    template: ''
})
export class RepoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private repoPopupService: RepoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.repoPopupService
                    .open(RepoDialogComponent as Component, params['id']);
            } else {
                this.repoPopupService
                    .open(RepoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
