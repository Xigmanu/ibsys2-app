import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KaufteildispoComponent } from './kaufteildispo.component';
import { mapJsonToFormControls } from './kaufteildispo.util';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

const mockSortedData = {
  "10": {
    "Typ": "E",
    "Nr": "10",
    "Bezeichnung": "Schutzblech h.",
    "Verwendung": "K",
    "Startmenge": 100.0,
    "Startpreis": "12,4",
    "Lieferkosten": null,
    "Lieferzeit": null,
    "Lieferzeitabweichung": null,
    "Arbeitsplatz 3": {
      "Bearbeitungszeit": null,
      "Rüstzeit": "2"
    },
    "Arbeitsplatz 4": {
      "Bearbeitungszeit": "1",
      "Rüstzeit": "3"
    },
    "Arbeitsplatz 6": {
      "Bearbeitungszeit": "3",
      "Rüstzeit": "2"
    }
  }
};

describe('KaufteildispoComponent', () => {
  let component: KaufteildispoComponent;
  let fixture: ComponentFixture<KaufteildispoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KaufteildispoComponent, ReactiveFormsModule, ClarityModule, CommonModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KaufteildispoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map the Json data to a form control', () => {
    const mappedData = mapJsonToFormControls(mockSortedData);
    expect(mappedData).toEqual({
      "10": {
        "kaufteil": "10",
        "frist": null,
        "abweichung": null,
        "diskontmenge": null,
        "verbrauch": null,
        "bestandAktuell": null,
        "lieferung": null,
        "lieferzeit": null,
        "benoetigteMenge": null,
        "bestellmenge": null,
        "bestelltyp": null
      }
    });
  });

  it('should calculate the needed amount of goods used in Production to meet the goals', () => {
    // wert mit
  });
});
