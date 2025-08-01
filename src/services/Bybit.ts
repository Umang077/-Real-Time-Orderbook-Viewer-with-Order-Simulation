// // src/services/Bybit.ts
// import type { Level } from '../hooks/useOrderbook';

// export class BybitService {
//   ws: WebSocket | null = null;

//   connectOrderbook(symbol: string, onUpdate: (data: { bids: Level[]; asks: Level[] }) => void) {
//     const mappedSymbol = symbol.replace('-', ''); // e.g., BTC-USDT → BTCUSDT
//     const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');

//     this.ws = ws;

//     ws.onopen = () => {
//       ws.send(JSON.stringify({
//         op: 'subscribe',
//         args: [`orderbook.50.${mappedSymbol}`]
//       }));
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.topic?.startsWith('orderbook.50')) {
//         const data = message.data;
//         const bids: Level[] = (data.b ?? []).map((b: any[]) => ({
//           price: parseFloat(b[0]),
//           size: parseFloat(b[1])
//         }));
//         const asks: Level[] = (data.a ?? []).map((a: any[]) => ({
//           price: parseFloat(a[0]),
//           size: parseFloat(a[1])
//         }));
//         onUpdate({ bids, asks });
//       }
//     };

//     ws.onerror = console.error;
//     ws.onclose = () => console.warn('[Bybit] WebSocket closed');

//     return ws;
//   }
// }

// src/services/Bybit.ts
import { throttle } from 'lodash';
import type { Level } from '../hooks/useOrderbook';

export class BybitService {
  ws: WebSocket | null = null;
  throttledUpdate: ((data: { bids: Level[]; asks: Level[] }) => void) | null = null;

  connectOrderbook(
    symbol: string,
    onUpdate: (data: { bids: Level[]; asks: Level[] }) => void
  ) {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    const mappedSymbol = symbol.replace('-', '');
    const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
    this.ws = ws;

    // Only allow updates once every 300ms (adjust as needed)
    this.throttledUpdate = throttle(onUpdate, 300);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: 'subscribe',
          args: [`orderbook.50.${mappedSymbol}`],
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.topic?.startsWith('orderbook.50')) {
        const data = message.data;
        const bids: Level[] = (data.b ?? []).map((b: any[]) => ({
          price: parseFloat(b[0]),
          size: parseFloat(b[1]),
        }));
        const asks: Level[] = (data.a ?? []).map((a: any[]) => ({
          price: parseFloat(a[0]),
          size: parseFloat(a[1]),
        }));

        // Use throttled update
        this.throttledUpdate?.({ bids, asks });
      }
    };

    ws.onerror = console.error;
    ws.onclose = () => console.warn('[Bybit] WebSocket closed');

    return ws;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Cancel any throttled function
    if (this.throttledUpdate) {
      this.throttledUpdate.cancel?.();
      this.throttledUpdate = null;
    }
  }
}
