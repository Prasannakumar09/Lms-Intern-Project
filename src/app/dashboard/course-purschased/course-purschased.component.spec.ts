import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePurschasedComponent } from './course-purschased.component';

describe('CoursePurschasedComponent', () => {
  let component: CoursePurschasedComponent;
  let fixture: ComponentFixture<CoursePurschasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursePurschasedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursePurschasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
