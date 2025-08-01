import { OKXService } from './OKX';
import { BybitService } from './Bybit';
import { DeribitService } from './Deribit';

export type Venue = 'OKX' | 'Bybit' | 'Deribit';

export class ExchangeManager {
  static get(v: Venue) {
    if (v === 'OKX') return new OKXService();
    if (v === 'Bybit') return new BybitService();
    return new DeribitService();
  }
}
