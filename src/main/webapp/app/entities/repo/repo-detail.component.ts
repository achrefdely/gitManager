import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Repo } from './repo.model';
import { RepoService } from './repo.service';

@Component({
    selector: 'jhi-repo-detail',
    templateUrl: './repo-detail.component.html'
})
export class RepoDetailComponent implements OnInit, OnDestroy {

    repo: Repo;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private repoService: RepoService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRepos();
    }

    load(id) {
        this.repoService.find(id)
            .subscribe((repoResponse: HttpResponse<Repo>) => {
                this.repo = repoResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRepos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'repoListModification',
            (response) => this.load(this.repo.id)
        );
    }
}
