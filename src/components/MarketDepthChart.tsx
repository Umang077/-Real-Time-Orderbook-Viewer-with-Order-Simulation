// src/components/MarketDepthChart.tsx
'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine,ResponsiveContainer  } from 'recharts';
import { Level } from '../hooks/useOrderbook';
import { simulationStateType } from '../store';

type Props = {
  bids: Level[];
  asks: Level[];
  simOrder?: simulationStateType;
};

export default function MarketDepthChart({ bids, asks, simOrder }: Props) {
  const cumulative = () => {
    let bidSum = 0;
    let askSum = 0;
    const depthData: { price: number; cumBid: number; cumAsk: number }[] = [];

    bids
      .sort((a, b) => b.price - a.price)
      .forEach((b) => {
        bidSum += b.size;
        depthData.push({ price: b.price, cumBid: bidSum, cumAsk: 0 });
      });

    asks
      .sort((a, b) => a.price - b.price)
      .forEach((a) => {
        askSum += a.size;
        depthData.push({ price: a.price, cumBid: 0, cumAsk: askSum });
      });

    return depthData.sort((a, b) => a.price - b.price);
  };

  const data = cumulative();

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-2">Market Depth Chart</h2>
      <ResponsiveContainer width="100%" height={300}>

      <AreaChart height={300} data={data}>
        <XAxis dataKey="price" domain={['auto', 'auto']} />
        <YAxis />
        <Tooltip />
        <Area type="step" dataKey="cumBid" stroke="green" fill="rgba(0,255,0,0.2)" />
        <Area type="step" dataKey="cumAsk" stroke="red" fill="rgba(255,0,0,0.2)" />
        {simOrder && (
          <ReferenceLine
            x={simOrder.price}
            stroke="blue"
            strokeDasharray="3 3"
            label={{ value: 'Your Order', position: 'top', fill: 'blue' }}
          />
        )}
      </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
