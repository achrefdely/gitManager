import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Commit } from './commit.model';
import { CommitService } from './commit.service';

@Injectable()
export class CommitPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private commitService: CommitService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.commitService.find(id)
                    .subscribe((commitResponse: HttpResponse<Commit>) => {
                        const commit: Commit = commitResponse.body;
                        if (commit.date) {
                            commit.date = {
                                year: commit.date.getFullYear(),
                                month: commit.date.getMonth() + 1,
                                day: commit.date.getDate()
                            };
                        }
                        this.ngbModalRef = this.commitModalRef(component, commit);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.commitModalRef(component, new Commit());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    commitModalRef(component: Component, commit: Commit): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.commit = commit;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
