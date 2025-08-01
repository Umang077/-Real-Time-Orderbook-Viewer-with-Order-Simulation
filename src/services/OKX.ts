import type { Level } from '../hooks/useOrderbook';

export class OKXService {
  ws: WebSocket | null = null;

  connectOrderbook(symbol: string, onUpdate: (data: { bids: Level[]; asks: Level[] }) => void) {
    const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
    this.ws = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [{ channel: 'books5', instId: symbol }]
      }));
    };
    ws.onmessage = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.arg?.channel === 'books5' && msg.data) {
        const data = msg.data[0];
        const bids = data.bids.map((b: any) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) }));
        const asks = data.asks.map((a: any) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) }));
        onUpdate({ bids, asks });
      }
    };
    ws.onclose = () => { /* reconnect logic optional */ };
    ws.onerror = console.error;
    return ws;
  }
}
