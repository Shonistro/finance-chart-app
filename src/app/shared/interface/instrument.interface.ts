export interface InstrumentsResponse {
  paging: Paging;
  data: Instrument[];
}

export interface Paging {
  page: number;
  pages: number;
  items: number;
}

export interface Instrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: { [key: string]: Mapping };
  profile: Profile;
}

export interface Mapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  maxOrderSize?: number;
  tradingHours: TradingHours;
}

export interface TradingHours {
  regularStart: string;
  regularEnd: string;
  electronicStart: string;
  electronicEnd: string;
}

export interface Profile {
  name: string;
  gics: any;
}
