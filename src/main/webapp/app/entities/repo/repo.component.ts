import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Repo } from './repo.model';
import { RepoService } from './repo.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-repo',
    templateUrl: './repo.component.html'
})
export class RepoComponent implements OnInit, OnDestroy {
repos: Repo[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private repoService: RepoService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.repoService.query().subscribe(
            (res: HttpResponse<Repo[]>) => {
                this.repos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInRepos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Repo) {
        return item.id;
    }
    registerChangeInRepos() {
        this.eventSubscriber = this.eventManager.subscribe('repoListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
