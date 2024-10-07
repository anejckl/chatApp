import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMessageCardComponent } from './system-message-card.component';

describe('SystemMessageCardComponent', () => {
  let component: SystemMessageCardComponent;
  let fixture: ComponentFixture<SystemMessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemMessageCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
