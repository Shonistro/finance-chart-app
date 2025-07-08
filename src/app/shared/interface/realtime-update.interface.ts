export interface L1Update {
    type: 'l1-update';
    instrumentId: string;
    provider: string;
    ask?: PriceLevel;
    bid?: PriceLevel;
    last?: LastTrade;
  }
  
  export interface PriceLevel {
    timestamp: string;
    price: number;
    volume: number;
  }
  
  export interface LastTrade extends PriceLevel {
    change: number;
    changePct: number;
  }