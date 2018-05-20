/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GitManagerTestModule } from '../../../test.module';
import { BranchDetailComponent } from '../../../../../../main/webapp/app/entities/branch/branch-detail.component';
import { BranchService } from '../../../../../../main/webapp/app/entities/branch/branch.service';
import { Branch } from '../../../../../../main/webapp/app/entities/branch/branch.model';

describe('Component Tests', () => {

    describe('Branch Management Detail Component', () => {
        let comp: BranchDetailComponent;
        let fixture: ComponentFixture<BranchDetailComponent>;
        let service: BranchService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GitManagerTestModule],
                declarations: [BranchDetailComponent],
                providers: [
                    BranchService
                ]
            })
            .overrideTemplate(BranchDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BranchDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BranchService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Branch(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.branch).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
