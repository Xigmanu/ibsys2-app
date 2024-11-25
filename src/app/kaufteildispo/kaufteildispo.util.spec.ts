import {mapJsonToFormControls, mapServiceDataToFormControls} from './kaufteildispo.util';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../data.service';

describe('KaufteildispoUtil', () => {
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;
  let dataService: DataService;

  beforeEach(() => {
    formBuilder = new FormBuilder();
    formGroup = formBuilder.group({
      KAUFTEIL: [''],
      FRIST: [''],
      ABWEICHUNG: [''],
      DISKONTMENGE: [''],
      VERBRAUCH: [''],
      BESTAND_AKTUELL: [''],
      EINGEHENDELIEFERUNG: [''],
      ANKUNFTSZEIT: [''],
      BENOETIGTE_MENGE: [''],
      BESTELLMENGE: [''],
      BESTELLTYP: ['']
    });

    dataService = {
      getData: jasmine.createSpy('getData').and.returnValue({
        input: {
          inwardStockMovement: [
            {
              orderPeriod: 5,
              id: 7,
              mode: 5,
              article: 41,
              amount: 900,
              time: 37440,
              materialCosts: 48.6,
              orderCosts: 50.0,
              entireCosts: 98.6,
              pieceCosts: 0.11
            }
          ]
        }
      })
    } as any;
  });

  it('should map JSON data to form controls', () => {
    const jsonData = {
      '1': {Typ: 'K', Nr: 'K1', Lieferzeit: '2023-10-01', Lieferzeitabweichung: '2'}
    };
    const mappedData = mapJsonToFormControls(jsonData);
    expect(mappedData).toEqual({
      '1': {
        kaufteil: 'K1',
        frist: '2023-10-01',
        abweichung: '2',
        diskontmenge: null,
        verbrauch: null,
        bestandAktuell: null,
        lieferung: null,
        lieferzeit: '2023-10-01',
        benoetigteMenge: null,
        bestellmenge: null,
        bestelltyp: null
      }
    });
  });

  it('should map service data to form controls', () => {
    const mappedServiceData = mapServiceDataToFormControls(dataService);
    expect(mappedServiceData).toEqual({
      '1': {
        kaufteil: '41',
        frist: '5_7',
        abweichung: '2',
        diskontmenge: null,
        verbrauch: null,
        bestandAktuell: null,
        lieferung: null,
        lieferzeit: '2023-10-01',
        benoetigteMenge: null,
        bestellmenge: null,
        bestelltyp: null
      }
    });
  });
});
