import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsizeComponent } from './lotsize.component';

describe('LotsizeComponent', () => {
  let component: LotsizeComponent;
  let fixture: ComponentFixture<LotsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotsizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
