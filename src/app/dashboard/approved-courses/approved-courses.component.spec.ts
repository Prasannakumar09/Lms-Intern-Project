import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCoursesComponent } from './approved-courses.component';

describe('ApprovedCoursesComponent', () => {
  let component: ApprovedCoursesComponent;
  let fixture: ComponentFixture<ApprovedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
