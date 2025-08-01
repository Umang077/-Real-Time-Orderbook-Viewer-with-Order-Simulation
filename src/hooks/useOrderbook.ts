import { useEffect, useState } from 'react';
import { ExchangeManager } from '../services/ExchangeManager';

export type Level = { price: number; size: number };
export function useOrderbook(venue: 'OKX' | 'Bybit' | 'Deribit', symbol: string) {
  const [bids, setBids] = useState<Level[]>([]);
  const [asks, setAsks] = useState<Level[]>([]);
  useEffect(() => {
    if (!symbol) return;
    const svc = ExchangeManager.get(venue);
    const ws = svc.connectOrderbook(symbol, (data: { bids: Level[]; asks: Level[] }) => {
      setBids(data.bids.slice(0, 15));
      setAsks(data.asks.slice(0, 15));
    });
    return () => { ws.close(); };
  }, [venue, symbol]);
  return { bids, asks };
}
