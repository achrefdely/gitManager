import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Branch } from './branch.model';
import { BranchPopupService } from './branch-popup.service';
import { BranchService } from './branch.service';

@Component({
    selector: 'jhi-branch-dialog',
    templateUrl: './branch-dialog.component.html'
})
export class BranchDialogComponent implements OnInit {

    branch: Branch;
    isSaving: boolean;
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private branchService: BranchService,
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
        if (this.branch.id !== undefined) {
            this.subscribeToSaveResponse(
                this.branchService.update(this.branch));
        } else {
            this.subscribeToSaveResponse(
                this.branchService.create(this.branch));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Branch>>) {
        result.subscribe((res: HttpResponse<Branch>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Branch) {
        this.eventManager.broadcast({ name: 'branchListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-branch-popup',
    template: ''
})
export class BranchPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private branchPopupService: BranchPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.branchPopupService
                    .open(BranchDialogComponent as Component, params['id']);
            } else {
                this.branchPopupService
                    .open(BranchDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
