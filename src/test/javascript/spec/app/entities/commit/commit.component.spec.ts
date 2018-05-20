/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GitManagerTestModule } from '../../../test.module';
import { CommitComponent } from '../../../../../../main/webapp/app/entities/commit/commit.component';
import { CommitService } from '../../../../../../main/webapp/app/entities/commit/commit.service';
import { Commit } from '../../../../../../main/webapp/app/entities/commit/commit.model';

describe('Component Tests', () => {

    describe('Commit Management Component', () => {
        let comp: CommitComponent;
        let fixture: ComponentFixture<CommitComponent>;
        let service: CommitService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [CommitComponent],
                providers: [
                    CommitService
                ]
            })
            .overrideTemplate(CommitComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CommitComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommitService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Commit(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.commits[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
