/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GitManagerTestModule } from '../../../test.module';
import { BranchComponent } from '../../../../../../main/webapp/app/entities/branch/branch.component';
import { BranchService } from '../../../../../../main/webapp/app/entities/branch/branch.service';
import { Branch } from '../../../../../../main/webapp/app/entities/branch/branch.model';

describe('Component Tests', () => {

    describe('Branch Management Component', () => {
        let comp: BranchComponent;
        let fixture: ComponentFixture<BranchComponent>;
        let service: BranchService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [BranchComponent],
                providers: [
                    BranchService
                ]
            })
            .overrideTemplate(BranchComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BranchComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BranchService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Branch(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.branches[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
