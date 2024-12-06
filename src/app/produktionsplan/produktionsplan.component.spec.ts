import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktionsplanComponent } from './produktionsplan.component';

describe('ProduktionsplanComponent', () => {
  let component: ProduktionsplanComponent;
  let fixture: ComponentFixture<ProduktionsplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduktionsplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduktionsplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
