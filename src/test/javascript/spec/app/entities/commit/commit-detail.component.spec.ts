/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GitManagerTestModule } from '../../../test.module';
import { CommitDetailComponent } from '../../../../../../main/webapp/app/entities/commit/commit-detail.component';
import { CommitService } from '../../../../../../main/webapp/app/entities/commit/commit.service';
import { Commit } from '../../../../../../main/webapp/app/entities/commit/commit.model';

describe('Component Tests', () => {

    describe('Commit Management Detail Component', () => {
        let comp: CommitDetailComponent;
        let fixture: ComponentFixture<CommitDetailComponent>;
        let service: CommitService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [CommitDetailComponent],
                providers: [
                    CommitService
                ]
            })
            .overrideTemplate(CommitDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CommitDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommitService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Commit(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.commit).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
