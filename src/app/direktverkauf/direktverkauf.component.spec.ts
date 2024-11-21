import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirektverkaufComponent } from './direktverkauf.component';

describe('DirektverkaufComponent', () => {
  let component: DirektverkaufComponent;
  let fixture: ComponentFixture<DirektverkaufComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirektverkaufComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirektverkaufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
