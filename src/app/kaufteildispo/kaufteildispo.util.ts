import {FormGroup} from '@angular/forms';
import {
  DataService,
  FutureInwardStockMovementOrder,
  MetaData, Output, SellWishItem,
} from '../data.service';

export enum KauftelidispoArt {
  KAUFTEIL = 'kaufteil',
  FRIST = 'frist',
  ABWEICHUNG = 'abweichung',
  DISKONTMENGE = 'Diskontmenge',
  VERBRAUCH_AKTUELL = 'N',
  VERBRAUCH_PROGNOSE_1 = 'N+1',
  VERBRAUCH_PROGNOSE_2 = 'N+2',
  VERBRAUCH_PROGNOSE_3 = 'N+3',
  VERBRAUCH_PROGNOSE_GES = 'Summe Bedarf',
  BESTAND_AKTUELL = 'bestand Aktuell',
  EINGEHENDELIEFERUNG = 'eingehende Lieferung',
  ANKUNFTSZEIT_EINGEHEND = 'ankunftszeit eingehend',
  BENOETIGTE_MENGE = 'benoetigte Menge',
  BESTELLUNG_LIEFERTERMIN = 'bestellung Liefertermin',
  BESTELLMENGE = 'bestellmenge',
  BESTELLTYP = 'bestelltyp'
}

export function Uebernehmen(formGroup: FormGroup): void {
}

export function mapDataToFormControls(jsonData: any, dataService: DataService, dispoForm: FormGroup, metaData: MetaData,output :Output): any {
  const mappedData: any = {};
  const productionQuantities:any = {};
  const primaryArticleIds: number[] = [1, 2, 3];


  // Map JSON data
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const item = jsonData[key];
      if (item.Typ === 'K') {
        mappedData[key] = {
          [KauftelidispoArt.KAUFTEIL]: item.Nr,
          [KauftelidispoArt.FRIST]: item.Lieferzeit,
          [KauftelidispoArt.ABWEICHUNG]: item.Lieferzeitabweichung,
          [KauftelidispoArt.BESTELLUNG_LIEFERTERMIN]: getBestellLiefertermin(
            metaData,
            item.Lieferzeit,
            dispoForm
              .get('tableRows')
              ?.get(KauftelidispoArt.BESTELLTYP)
              ?.value),
          [KauftelidispoArt.VERBRAUCH_AKTUELL]: calculateVerbrauch(item.usedIn, output),
          [KauftelidispoArt.VERBRAUCH_PROGNOSE_1]: calculateVerbrauch(item.usedIn, output),
        };
      }
    }
  }
  const serviceData = dataService.getData();
  if (serviceData && serviceData.input && serviceData.input.futureInwardStockMovement) {
    serviceData.input.futureInwardStockMovement.forEach((order: any) => {
      const frist = jsonData[order.article]?.Lieferzeit || 0;
      if (!mappedData[order.article]) {
        mappedData[order.article] = {};
      }
      mappedData[order.article] = {
        ...mappedData[order.article],
        [KauftelidispoArt.KAUFTEIL]: order.article,
        [KauftelidispoArt.DISKONTMENGE]: order.article,
        [KauftelidispoArt.EINGEHENDELIEFERUNG]: order.amount,
        [KauftelidispoArt.ANKUNFTSZEIT_EINGEHEND]: getEingehendeLieferung(order, frist,
          dispoForm
            .get('tableRows')
            ?.get(KauftelidispoArt.BESTELLTYP)
            ?.value),
        inwardStockMovement: order
      };
    });
  }
  if (serviceData && serviceData.input && serviceData.input.warehouseStock) {
    serviceData.input.warehouseStock.forEach((stock: any) => {
      if (mappedData.hasOwnProperty(stock.id)) {
        mappedData[stock.id] = {
          ...mappedData[stock.id],
          [KauftelidispoArt.BESTAND_AKTUELL]: stock.amount,
        };
      }
    });
  }
if(serviceData.output && serviceData.output.sellWish){

}
  return mappedData;
}

export function getEingehendeLieferung(inwardStock: FutureInwardStockMovementOrder, frist: string, bestelltyp: string): string {

  const periodDays = 5;
  const fristNumber = parseFloat(frist.replace(',', '.'));
  let totalDays = Math.round(fristNumber * periodDays);
  const arrivalPeriod = Math.floor(totalDays / periodDays);
  const extraDays = totalDays % periodDays;
  const date: string = `${inwardStock.orderPeriod + arrivalPeriod}_${extraDays}`;
  return date;
}

export function getBestellLiefertermin(metaData: MetaData, frist: string, bestelltyp: string): string {

  const periodDays = 5;
  const fristNumber = parseFloat(frist.replace(',', '.'));
  let totalDays = Math.round(fristNumber * periodDays);
  if (bestelltyp === 'E') {
    totalDays = Math.round(totalDays / 2)
  }
  const arrivalPeriod = Math.floor(totalDays / periodDays);
  const extraDays = totalDays % periodDays;
  const date: string = `${parseFloat(metaData.period) + arrivalPeriod + 1}_${extraDays}`;
  return date;
}
function getSellwishItem(id: number, output: Output): SellWishItem | undefined {
    return output.sellWish.items.find((item) => item.article === id);
}
function calculateVerbrauch( usedIn: { P1: number, P2: number, P3: number }, output : Output): number {
  const sellwish_P1 = getSellwishItem(1, output)?.quantity ?? 0;
  const sellwish_P2 = getSellwishItem(2, output)?.quantity ?? 0;
  const sellwish_P3 = getSellwishItem(3, output)?.quantity ?? 0;
  return (usedIn.P1* sellwish_P1) +
    (usedIn.P2*sellwish_P2) +
    (usedIn.P3 * sellwish_P3);
}

