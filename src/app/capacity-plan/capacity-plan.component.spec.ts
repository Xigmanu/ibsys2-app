import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityPlanComponent } from './capacity-plan.component';

describe('CapacityPlanComponent', () => {
  let component: CapacityPlanComponent;
  let fixture: ComponentFixture<CapacityPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacityPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
