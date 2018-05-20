/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GitManagerTestModule } from '../../../test.module';
import { RepoDetailComponent } from '../../../../../../main/webapp/app/entities/repo/repo-detail.component';
import { RepoService } from '../../../../../../main/webapp/app/entities/repo/repo.service';
import { Repo } from '../../../../../../main/webapp/app/entities/repo/repo.model';

describe('Component Tests', () => {

    describe('Repo Management Detail Component', () => {
        let comp: RepoDetailComponent;
        let fixture: ComponentFixture<RepoDetailComponent>;
        let service: RepoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [RepoDetailComponent],
                providers: [
                    RepoService
                ]
            })
            .overrideTemplate(RepoDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RepoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RepoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Repo(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.repo).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
