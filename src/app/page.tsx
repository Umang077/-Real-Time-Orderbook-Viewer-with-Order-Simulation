// 'use client';
// import React from 'react';
// import OrderbookDisplay from '../components/OrderbookDisplay';
// import OrderSimulationForm from '../components/OrderSimulationForm';
// import { useOrderbook } from '../hooks/useOrderbook';
// import { useStore } from '../store';
// import { simulateOrder } from '../utils/simulation';
// import MarketDepthChart from '../components/MarketDepthChart';

// export default function HomePage() {
//   const { simulation } = useStore();
//   const { bids, asks } = useOrderbook(simulation?.venue ?? 'OKX', simulation?.symbol ?? 'BTC-USDT');

//   const metrics = simulation
//     ? simulateOrder(simulation, bids, asks)
//     : undefined;

//   return (
//     <div className="p-4 flex flex-col md:flex-row gap-6">
//       <OrderbookDisplay bids={bids} asks={asks} simOrder={simulation} />
//       <div className="w-full max-w-md">
//         <OrderSimulationForm />
//         <MarketDepthChart bids={bids} asks={asks} simOrder={simulation} />

//         {metrics && (
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold">Order Impact Metrics</h2>
//             <ul className="list-disc pl-5 mt-2">
//               <li>Fill %: {metrics.fillPct.toFixed(2)}%</li>
//               <li>Avg Price: {metrics.avgPrice.toFixed(2)}</li>
//               <li>Slippage: {metrics.slippage.toFixed(2)}%</li>
//               <li>Market Impact: {metrics.impact.toFixed(2)}%</li>
//               <li>
//                 Estimated Time to Fill: {simulation?.timingMs === 0
//                   ? 'Immediate'
//                   : `${(simulation?.timingMs ?? 0) / 1000}s delay`}
//               </li>            
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
import React from 'react';
import OrderbookDisplay from '../components/OrderbookDisplay';
import OrderSimulationForm from '../components/OrderSimulationForm';
import { useOrderbook } from '../hooks/useOrderbook';
import { useStore } from '../store';
import { simulateOrder } from '../utils/simulation';
import MarketDepthChart from '../components/MarketDepthChart';

export default function HomePage() {
  const { simulation } = useStore();
  const { bids, asks } = useOrderbook(simulation?.venue ?? 'OKX', simulation?.symbol ?? 'BTC-USDT');

  const metrics = simulation
    ? simulateOrder(simulation, bids, asks)
    : undefined;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Orderbook + Chart */}
        <div className="flex-1 space-y-6">
          {/* Orderbook Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Live Orderbook</h2>
            <OrderbookDisplay bids={bids} asks={asks} simOrder={simulation} />
          </div>

          {/* Market Depth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Market Depth Chart</h2>
            <MarketDepthChart bids={bids} asks={asks} simOrder={simulation} />
          </div>
        </div>

        {/* Right column: Simulation Form + Metrics */}
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Simulate Order</h2>
            <OrderSimulationForm />
          </div>

          {metrics && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <h2 className="text-xl font-semibold mb-4">Order Impact Metrics</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Fill %:</strong> {metrics.fillPct.toFixed(2)}%</li>
                <li><strong>Avg Price:</strong> {metrics.avgPrice.toFixed(2)}</li>
                <li><strong>Slippage:</strong> {metrics.slippage.toFixed(2)}%</li>
                <li><strong>Market Impact:</strong> {metrics.impact.toFixed(2)}%</li>
                <li><strong>Estimated Time to Fill:</strong> {simulation?.timingMs === 0
                  ? 'Immediate'
                  : `${(simulation?.timingMs ?? 0) / 1000}s delay`}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

