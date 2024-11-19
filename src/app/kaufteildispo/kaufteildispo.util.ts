import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Component, OnInit, Input} from '@angular/core';

export interface KaufteilDispoControlFormDefinition {
  label: string;
  formControlName: keyof KaufteilDispoFormControl;
  formControl: AbstractControl;
  type: string;
  tooltip: string;
}

export enum KauftelidispoArt {
  KAUFTEIL = 'kaufteil',
  FRIST = 'frist',
  ABWEICHUNG = 'abweichung',
  DISKONTMENGE = 'diskontmenge',
  VERBRAUCH = 'verbrauch',
  BESTAND_AKTUELL = 'bestandAktuell',
  LIEFERUNG = 'lieferung',
  LIEFERZEIT = 'liferzeit',
  BENOETIGTE_MENGE = 'benoetigteMenge',
  BESTELLMENGE = 'bestellmenge',
  BESTELLTYP = 'bestelltyp'
}

export interface KaufteilDispoFormControl {
  [KauftelidispoArt.KAUFTEIL]: FormControl;
  [KauftelidispoArt.FRIST]: FormControl;
  [KauftelidispoArt.ABWEICHUNG]: FormControl;
  [KauftelidispoArt.DISKONTMENGE]: FormControl;
  [KauftelidispoArt.VERBRAUCH]: FormControl;
  [KauftelidispoArt.BESTAND_AKTUELL]: FormControl;
  [KauftelidispoArt.LIEFERUNG]: FormControl;
  [KauftelidispoArt.LIEFERZEIT]: FormControl;
  [KauftelidispoArt.BENOETIGTE_MENGE]: FormControl;
  [KauftelidispoArt.BESTELLMENGE]: FormControl;
  [KauftelidispoArt.BESTELLTYP]: FormControl;
}

export function dispoControlForms(formFroup: FormGroup, mappedData: any): KaufteilDispoControlFormDefinition[] {
  return [{
    label: 'Kaufteil',
    formControlName: KauftelidispoArt.KAUFTEIL,
    formControl: new FormControl(mappedData[KauftelidispoArt.KAUFTEIL])!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Frist',
    formControlName: KauftelidispoArt.FRIST,
    formControl: formFroup.get(KauftelidispoArt.FRIST)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Abweichung',
    formControlName: KauftelidispoArt.ABWEICHUNG,
    formControl: formFroup.get(KauftelidispoArt.ABWEICHUNG)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Diskontmenge',
    formControlName: KauftelidispoArt.DISKONTMENGE,
    formControl: formFroup.get(KauftelidispoArt.DISKONTMENGE)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Verbrauch',
    formControlName: KauftelidispoArt.VERBRAUCH,
    formControl: formFroup.get(KauftelidispoArt.VERBRAUCH)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Bestand Aktuell',
    formControlName: KauftelidispoArt.BESTAND_AKTUELL,
    formControl: formFroup.get(KauftelidispoArt.BESTAND_AKTUELL)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Lieferung',
    formControlName: KauftelidispoArt.LIEFERUNG,
    formControl: formFroup.get(KauftelidispoArt.LIEFERUNG)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Lieferzeit',
    formControlName: KauftelidispoArt.LIEFERZEIT,
    formControl: formFroup.get(KauftelidispoArt.LIEFERZEIT)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Benoetigte Menge',
    formControlName: KauftelidispoArt.BENOETIGTE_MENGE,
    formControl: formFroup.get(KauftelidispoArt.BENOETIGTE_MENGE)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Bestellmenge',
    formControlName: KauftelidispoArt.BESTELLMENGE,
    formControl: formFroup.get(KauftelidispoArt.BESTELLMENGE)!,
    type: 'text',
    tooltip: '',
  }, {
    label: 'Bestelltyp',
    formControlName: KauftelidispoArt.BESTELLTYP,
    formControl: formFroup.get(KauftelidispoArt.BESTELLTYP)!,
    type: 'dropdown',
    tooltip: '',
  }]
}

export function mapJsonToFormControls(jsonData: any): any {
  const mappedData: any = {};
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const item = jsonData[key];
      mappedData[key] = {
        [KauftelidispoArt.KAUFTEIL]: item.Nr,
        [KauftelidispoArt.FRIST]: item.Lieferzeit,
        [KauftelidispoArt.ABWEICHUNG]: item.Lieferzeitabweichung,
        [KauftelidispoArt.DISKONTMENGE]: null,
        [KauftelidispoArt.VERBRAUCH]: null,
        [KauftelidispoArt.BESTAND_AKTUELL]: null,
        [KauftelidispoArt.LIEFERUNG]: null,
        [KauftelidispoArt.LIEFERZEIT]: item.Lieferzeit,
        [KauftelidispoArt.BENOETIGTE_MENGE]: null,
        [KauftelidispoArt.BESTELLMENGE]: null,
        [KauftelidispoArt.BESTELLTYP]: null
      };
    }
  }
  return mappedData;
}
