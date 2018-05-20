import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Commit } from './commit.model';
import { CommitService } from './commit.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-commit',
    templateUrl: './commit.component.html'
})
export class CommitComponent implements OnInit, OnDestroy {
commits: Commit[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private commitService: CommitService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.commitService.query().subscribe(
            (res: HttpResponse<Commit[]>) => {
                this.commits = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCommits();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Commit) {
        return item.id;
    }
    registerChangeInCommits() {
        this.eventSubscriber = this.eventManager.subscribe('commitListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
