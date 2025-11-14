import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorAnnouncementComponent } from './mentor-announcement.component';

describe('MentorAnnouncementComponent', () => {
  let component: MentorAnnouncementComponent;
  let fixture: ComponentFixture<MentorAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentorAnnouncementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentorAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
