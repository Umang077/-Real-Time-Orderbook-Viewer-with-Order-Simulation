import React from 'react';
import { Level } from '../hooks/useOrderbook';
import { simulationStateType } from '../store/index';

type Props = {
  bids: Level[];
  asks: Level[];
  simOrder?: simulationStateType;
};

export default function OrderbookDisplay({ bids, asks, simOrder }: Props) {
  const maxSize = Math.max(
    ...bids.map(b => b.size),
    ...asks.map(a => a.size),
    simOrder?.quantity ?? 0
  );

  const renderRows = (levels: Level[], side: 'bids' | 'asks') => {
    return levels.map((lvl, idx) => {
      const barWidth = (lvl.size / maxSize) * 100;
      const isSim = simOrder && simOrder.side === (side === 'bids' ? 'Buy' : 'Sell')
        && simOrder.price === lvl.price;
      return (
        <div key={`${side}-${idx}`} className={`flex justify-between items-center py-1 ${isSim ? 'bg-blue-100 border-blue-500 border' : ''}`}>
          <div className={`text-${side === 'bids' ? 'green' : 'red'}-600`}>{lvl.price.toFixed(2)}</div>
          <div className="flex-1 mx-2">
            <div style={{ width: `${barWidth}%`, background: side === 'bids' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)', height: '8px' }} />
          </div>
          <div>{lvl.size.toFixed(2)}</div>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 font-semibold">Asks</div>
      {renderRows(asks, 'asks')}
      <hr className="my-2" />
      <div className="mb-2 font-semibold">Bids</div>
      {renderRows(bids, 'bids')}
    </div>
  );
}
