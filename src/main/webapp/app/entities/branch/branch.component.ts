import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Branch } from './branch.model';
import { BranchService } from './branch.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-branch',
    templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit, OnDestroy {
branches: Branch[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private branchService: BranchService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.branchService.query().subscribe(
            (res: HttpResponse<Branch[]>) => {
                this.branches = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBranches();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Branch) {
        return item.id;
    }
    registerChangeInBranches() {
        this.eventSubscriber = this.eventManager.subscribe('branchListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
