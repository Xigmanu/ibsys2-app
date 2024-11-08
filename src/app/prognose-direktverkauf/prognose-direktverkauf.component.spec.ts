import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrognoseDirektverkaufComponent } from './prognose-direktverkauf.component';

describe('PrognoseDirektverkaufComponent', () => {
  let component: PrognoseDirektverkaufComponent;
  let fixture: ComponentFixture<PrognoseDirektverkaufComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrognoseDirektverkaufComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrognoseDirektverkaufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
