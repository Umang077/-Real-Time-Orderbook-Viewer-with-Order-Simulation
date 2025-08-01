// src/services/Deribit.ts
import type { Level } from '../hooks/useOrderbook';

export class DeribitService {
  ws: WebSocket | null = null;

  connectOrderbook(symbol: string, onUpdate: (data: { bids: Level[]; asks: Level[] }) => void) {
    const instId = symbol.toLowerCase(); // BTC-USD → btc-usd
    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');

    this.ws = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 42,
        method: 'public/subscribe',
        params: {
          channels: [`book.${instId}.none.10.100ms`]
        }
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.method === 'subscription' && message.params?.data) {
        const data = message.params.data;
        const bids: Level[] = (data.bids ?? []).map((b: any[]) => ({
          price: b[0],
          size: b[1]
        }));
        const asks: Level[] = (data.asks ?? []).map((a: any[]) => ({
          price: a[0],
          size: a[1]
        }));
        onUpdate({ bids, asks });
      }
    };

    ws.onerror = console.error;
    ws.onclose = () => console.warn('[Deribit] WebSocket closed');

    return ws;
  }
}
