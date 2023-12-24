export enum InvoicingType {
  NORMAL = "普票",
  SPECIAL = "专票",
}

export enum Moneytype {
  Dollar = "美元",
  RMB = "人民币",
}

export enum BoolType {
  YES = "√",
  NO = "x",
}

export const InvoicingTypeArr = [InvoicingType.NORMAL, InvoicingType.SPECIAL];

export const MoneytypeArr = [Moneytype.RMB, Moneytype.Dollar];

export const BooltypeArr = [BoolType.NO, BoolType.YES];
