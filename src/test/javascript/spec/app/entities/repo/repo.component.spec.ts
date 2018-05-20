/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GitManagerTestModule } from '../../../test.module';
import { RepoComponent } from '../../../../../../main/webapp/app/entities/repo/repo.component';
import { RepoService } from '../../../../../../main/webapp/app/entities/repo/repo.service';
import { Repo } from '../../../../../../main/webapp/app/entities/repo/repo.model';

describe('Component Tests', () => {

    describe('Repo Management Component', () => {
        let comp: RepoComponent;
        let fixture: ComponentFixture<RepoComponent>;
        let service: RepoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [RepoComponent],
                providers: [
                    RepoService
                ]
            })
            .overrideTemplate(RepoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RepoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RepoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Repo(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.repos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
