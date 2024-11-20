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

export function Uebernehmen(formGroup: FormGroup): void {
}
export type kaufteilDispoFormDef={[key in KauftelidispoArt]: KaufteilDispoControlFormDefinition }

export function dispoControlFormDefinition(
  formGroup: FormGroup)
  : kaufteilDispoFormDef {
  return {
    [KauftelidispoArt.KAUFTEIL]: {
      label: 'Kaufteil',
      formControlName: KauftelidispoArt.KAUFTEIL,
      formControl: formGroup.get(KauftelidispoArt.KAUFTEIL)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.FRIST]: {
      label: 'Frist',
      formControlName: KauftelidispoArt.FRIST,
      formControl: formGroup.get(KauftelidispoArt.FRIST)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.ABWEICHUNG]: {
      label: 'Abweichung',
      formControlName: KauftelidispoArt.ABWEICHUNG,
      formControl: formGroup.get(KauftelidispoArt.ABWEICHUNG)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.DISKONTMENGE]: {
      label: 'Diskontmenge',
      formControlName: KauftelidispoArt.DISKONTMENGE,
      formControl: formGroup.get(KauftelidispoArt.DISKONTMENGE)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.VERBRAUCH]: {
      label: 'Verbrauch',
      formControlName: KauftelidispoArt.VERBRAUCH,
      formControl: formGroup.get(KauftelidispoArt.VERBRAUCH)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.BESTAND_AKTUELL]: {
      label: 'Bestand Aktuell',
      formControlName: KauftelidispoArt.BESTAND_AKTUELL,
      formControl: formGroup.get(KauftelidispoArt.BESTAND_AKTUELL)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.LIEFERUNG]: {
      label: 'Lieferung',
      formControlName: KauftelidispoArt.LIEFERUNG,
      formControl: formGroup.get(KauftelidispoArt.LIEFERUNG)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.LIEFERZEIT]: {
      label: 'Lieferzeit',
      formControlName: KauftelidispoArt.LIEFERZEIT,
      formControl: formGroup.get(KauftelidispoArt.LIEFERZEIT)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.BENOETIGTE_MENGE]: {
      label: 'Benoetigte Menge',
      formControlName: KauftelidispoArt.BENOETIGTE_MENGE,
      formControl: formGroup.get(KauftelidispoArt.BENOETIGTE_MENGE)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.BESTELLMENGE]: {
      label: 'Bestellmenge',
      formControlName: KauftelidispoArt.BESTELLMENGE,
      formControl: formGroup.get(KauftelidispoArt.BESTELLMENGE)!,
      type: 'text',
      tooltip: '',
    },
    [KauftelidispoArt.BESTELLTYP]: {
      label: 'Bestelltyp',
      formControlName: KauftelidispoArt.BESTELLTYP,
      formControl: formGroup.get(KauftelidispoArt.BESTELLTYP)!,
      type: 'dropdown',
      tooltip: '',
    }
  }
}
export function mapJsonToFormControls(jsonData: any): any {
  const mappedData: any = {};
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const item = jsonData[key];
      if (item.Typ === 'K') {
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
  }
  return mappedData;
}
