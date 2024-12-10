import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {
  DataService,
  FutureInwardStockMovementOrder,
  MetaData, Output, ProductionInput, SellWishItem,
} from '../data.service';
export enum KaufteildispoArt {
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
  BESTELLTYP = 'bestelltyp',
  BESTANDNACH1 = 'bestand nach 1',
  BESTANDNACH2 = 'bestand nach 2',
  BESTANDNACH3 = 'bestand nach 3',
  BESTANDNACH4 = 'bestand nach 4',
}

export enum ForecastArt {
  PRODUKT = 'Product',
  PERIODE_0 = 'Sellwish',
  PERIODE_1 = 'Periode 1',
  PERIODE_2 = 'Periode 2',
  PERIODE_3 = 'Periode 3',
}


export function Uebernehmen(formGroup: FormGroup): void {
}
const diskontmengen: number[] = [
  300, 300, 300, 6100, 3600, 0, 1800, 4500, 0, 0, 0, 2700, 900, 22000, 3600, 900, 900, 300, 1800, 900, 900, 1800, 2700, 900, 900, 900, 900, 1800, 0,0,0, 600, 22000,0, 0, 0, 600,22000, 1800
];
export function mapDataToFormControls(jsonData: any, dataService: DataService, dispoForm: FormGroup, metaData: MetaData, output: Output): any {
  const mappedData: any = {};
  const primaryArticleIds: number[] = [1, 2, 3];
  const futureInwardStockMovement = dataService.getData().input.futureInwardStockMovement || [];
  const warehouseStock = dataService.getData().input.warehouseStock || [];

  // Map JSON data
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const item = jsonData[key];
      if (item.Typ === 'K') {
        if (!item.usedIn) {
          console.error(`Missing usedIn for item: ${key}`);
          continue;
        }
        const verbrauchPrognose = calculateVerbrauchForPeriods(item.usedIn, dataService);
        const verbrauchAktuell = calculateVerbrauchProg(item.usedIn, dataService);
        const verbrauchPrognoseGesamt = verbrauchAktuell + verbrauchPrognose.period2 + verbrauchPrognose.period3 + verbrauchPrognose.period4;
        const incomingDelivery = futureInwardStockMovement.find((order: any) => order.article === item.Nr)?.amount || 0;
        const stockItem = warehouseStock.find((stock: any) => stock.id === item.Nr);
        const bestandAktuell = stockItem ? stockItem.amount : 0;
        const diskontmenge = diskontmengen[parseInt(item.Nr) - 21] || 0;
        mappedData[key] = {
          [KaufteildispoArt.KAUFTEIL]: item.Nr,
          [KaufteildispoArt.FRIST]: item.Lieferzeit,
          [KaufteildispoArt.ABWEICHUNG]: item.Lieferzeitabweichung,
          [KaufteildispoArt.DISKONTMENGE]: diskontmenge,
          [KaufteildispoArt.VERBRAUCH_AKTUELL]: verbrauchAktuell,
          [KaufteildispoArt.VERBRAUCH_PROGNOSE_1]: verbrauchPrognose.period2,
          [KaufteildispoArt.VERBRAUCH_PROGNOSE_2]: verbrauchPrognose.period3,
          [KaufteildispoArt.VERBRAUCH_PROGNOSE_3]: verbrauchPrognose.period4,
          [KaufteildispoArt.VERBRAUCH_PROGNOSE_GES]: verbrauchPrognoseGesamt,
          [KaufteildispoArt.BESTELLUNG_LIEFERTERMIN]: getBestellLiefertermin(metaData, item.Lieferzeit, dispoForm.get('tableRows')?.get(KaufteildispoArt.BESTELLTYP)?.value),
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
        [KaufteildispoArt.EINGEHENDELIEFERUNG]: order.amount,
        [KaufteildispoArt.ANKUNFTSZEIT_EINGEHEND]: getEingehendeLieferung(order, frist,
          dispoForm
            .get('tableRows')
            ?.get(KaufteildispoArt.BESTELLTYP)
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
          [KaufteildispoArt.BESTAND_AKTUELL]: stock.amount,
        };
      }
    });
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

function calculateVerbrauchProg(usedIn: { P1: number, P2: number, P3: number },dataService: DataService): number {
  let totalVerbrauch = 0;
    const productionP1 = dataService.getProductionListArticle(1) ?? 0;
    const productionP2 =  dataService.getProductionListArticle(2 ) ?? 0;
    const productionP3 =  dataService.getProductionListArticle(3) ?? 0;
    totalVerbrauch += (usedIn.P1 * productionP1) + (usedIn.P2 * productionP2) + (usedIn.P3 * productionP3);
  return totalVerbrauch;
}

function calculateVerbrauchForPeriods(usedIn: { P1: number, P2: number, P3: number }, dataService: DataService): { period2: number, period3: number, period4: number } {
  const periods = ['period2', 'period3', 'period4'] as const;
  const result = {
    period2: 0,
    period3: 0,
    period4: 0
  };

  if (!usedIn || typeof usedIn.P1 !== 'number' || typeof usedIn.P2 !== 'number' || typeof usedIn.P3 !== 'number') {
    console.error('Invalid usedIn object:', usedIn);
    return result;
  }

  periods.forEach(period => {
    const productionP1 = dataService.getDecisionProduction(1)[period]?.p1 ?? 0;
    const productionP2 = dataService.getDecisionProduction(2)[period]?.p2 ?? 0;
    const productionP3 = dataService.getDecisionProduction(3)[period]?.p3 ?? 0;
    result[period] = (usedIn.P1 * productionP1) + (usedIn.P2 * productionP2) + (usedIn.P3 * productionP3);
  });

  return result;
}
export function calculateBenoetigteMenge(verbrauchGesamt: number, bestandAktuell: number, eingehendeLieferung: number): number {
  const validVerbrauchGesamt = isNaN(verbrauchGesamt) ? 0 : verbrauchGesamt;
  const validBestandAktuell = isNaN(bestandAktuell) ? 0 : bestandAktuell;
  const validEingehendeLieferung = isNaN(eingehendeLieferung) ? 0 : eingehendeLieferung;

  const result = validVerbrauchGesamt - validBestandAktuell - validEingehendeLieferung;
  return result < 0 ? 0 : result;
}
export function findExceedingPeriod(verbrauchPrognose: { period2: number, period3: number, period4: number }, bestandAktuell: number, eingehendeLieferung: number, ankunftszeitEingehend: string | undefined): string | null {
  if (!ankunftszeitEingehend) {
    console.error('ankunftszeitEingehend is undefined');
    return null;
  }

  const periods = ['period2', 'period3', 'period4'] as const;
  let cumulativeDemand = 0;
  let deliveryPeriod = parseInt(ankunftszeitEingehend.split('_')[0]);

  for (const period of periods) {
    cumulativeDemand += verbrauchPrognose[period];
    if (cumulativeDemand > (bestandAktuell + (deliveryPeriod <= periods.indexOf(period) + 2 ? eingehendeLieferung : 0))) {
      return period;
    }
  }

  return null;
}
export function calculateStockAfterPeriods(
  initialStock: number,
  verbrauchAktuell: number,
  verbrauchPrognose: { period2: number, period3: number, period4: number },
  eingehendeLieferung: number,
  ankunftszeitEingehend: string | undefined,
  metadata: MetaData
): { stockAfterPeriod1: number, stockAfterPeriod2: number, stockAfterPeriod3: number, stockAfterPeriod4: number } {
  if (!ankunftszeitEingehend) {
    ankunftszeitEingehend='0_0';
  }

  const periode = parseInt(metadata.period);
  const periods = ['period2', 'period3', 'period4'] as const;
  let stock = initialStock - verbrauchAktuell;
  let [deliveryPeriod, extraDays] = ankunftszeitEingehend.split('_').map(Number);

  const stockAfterPeriods: { [key: string]: number } = {
    stockAfterPeriod1: stock,
    stockAfterPeriod2: 0,
    stockAfterPeriod3: 0,
    stockAfterPeriod4: 0
  };

  periods.forEach((period, index) => {
    stock -= verbrauchPrognose[period];
    if (periode + index + 1 === deliveryPeriod) {
      stock += eingehendeLieferung;
    }
    stockAfterPeriods[`stockAfterPeriod${index + 2}`] = stock;
  });

  return stockAfterPeriods as { stockAfterPeriod1: number, stockAfterPeriod2: number, stockAfterPeriod3: number, stockAfterPeriod4: number };
}
