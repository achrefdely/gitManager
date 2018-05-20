import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Commit } from './commit.model';
import { CommitService } from './commit.service';

@Component({
    selector: 'jhi-commit-detail',
    templateUrl: './commit-detail.component.html'
})
export class CommitDetailComponent implements OnInit, OnDestroy {

    commit: Commit;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private commitService: CommitService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCommits();
    }

    load(id) {
        this.commitService.find(id)
            .subscribe((commitResponse: HttpResponse<Commit>) => {
                this.commit = commitResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCommits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'commitListModification',
            (response) => this.load(this.commit.id)
        );
    }
}
