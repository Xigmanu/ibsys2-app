import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaufteildispoComponent } from './kaufteildispo.component';

describe('KaufteildispoComponent', () => {
  let component: KaufteildispoComponent;
  let fixture: ComponentFixture<KaufteildispoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KaufteildispoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KaufteildispoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
