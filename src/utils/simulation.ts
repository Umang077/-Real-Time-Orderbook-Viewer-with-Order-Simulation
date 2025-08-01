import { Level } from '../hooks/useOrderbook';
import { simulationStateType } from '../store';

export function simulateOrder(
  sim: simulationStateType,
  bids: Level[],
  asks: Level[]
) {
  const { side, quantity, type, price } = sim;
  const bookSide = side === 'Buy' ? asks : bids;
  let qtyLeft = quantity;
  let executed = 0;
  let cost = 0;
  let usedLevels = 0;

  if (type === 'Market') {
    for (const lvl of bookSide) {
      const take = Math.min(qtyLeft, lvl.size);
      cost += take * lvl.price;
      executed += take;
      qtyLeft -= take;
      usedLevels++;
      if (qtyLeft <= 0) break;
    }
  } else {
    // limit order: see where price fits
    for (const lvl of bookSide) {
      if ((side === 'Buy' && lvl.price <= (price ?? 0)) ||
          (side === 'Sell' && lvl.price >= (price ?? 0))) {
        const take = Math.min(qtyLeft, lvl.size);
        cost += take * lvl.price;
        executed += take;
        qtyLeft -= take;
      }
    }
  }

  const fillPct = (executed / quantity) * 100;
  const avgPrice = executed > 0 ? cost / executed : 0;
  const slippage = type === 'Market'
  ? ((avgPrice - (bookSide[0]?.price ?? avgPrice)) / (bookSide[0]?.price ?? avgPrice)) * 100
  : ((avgPrice - (price ?? avgPrice)) / ((price ?? avgPrice) || 1)) * 100;

  const impact = ((executed * avgPrice) / (bookSide.reduce((a, l) => a + l.size * l.price, 0))) * 100;

  return { executed, avgPrice, fillPct, slippage, impact };
}
