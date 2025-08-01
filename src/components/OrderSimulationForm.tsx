// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import useStore, { simulationStateType } from '../store';

// const schema = z.object({
//   venue: z.enum(['OKX','Bybit','Deribit']),
//   symbol: z.string().nonempty(),
//   type: z.enum(['Limit','Market']),
//   side: z.enum(['Buy','Sell']),
//   price: z.union([
//     z.preprocess(v => v === '' || v === undefined ? undefined : parseFloat(v as string), z.number().positive()),
//     z.undefined()
//   ]),
//   quantity: z.preprocess(v => parseFloat(v as string), z.number().positive()),
//   timing: z.enum(['immediate','5s','10s','30s'])
// }).refine(data => data.type === 'Market' || data.price !== undefined, {
//   message: 'Limit orders require price',
//   path: ['price']
// });

// type FormInput = z.infer<typeof schema>;


// export default function OrderSimulationForm() {
//   const { setSimulation } = useStore();
//   const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInput>({
//     resolver: zodResolver(schema),
//     defaultValues: { venue: 'OKX', symbol: 'BTC-USDT', type: 'Limit', side: 'Buy', quantity: 1, timing: 'immediate' }
//   });

//   const onSubmit = (data: FormInput) => {
//     const timingMs = { immediate: 0, '5s': 5000, '10s': 10000, '30s': 30000 }[data.timing];
//     const sim: simulationStateType = {
//       venue: data.venue, symbol: data.symbol,
//       type: data.type, side: data.side,
//       price: data.price, quantity: data.quantity,
//       timingMs
//     };
//     setSimulation(sim);
//   };

//   const showPrice = watch('type') === 'Limit';

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <select {...register('venue')} className="block w-full">
//         <option value="OKX">OKX</option>
//         <option value="Bybit">Bybit</option>
//         <option value="Deribit">Deribit</option>
//       </select>
//       <input type="text" {...register('symbol')} placeholder="Symbol (e.g. BTC-USDT)" className="block w-full" />
//       <select {...register('type')} className="block w-full">
//         <option value="Limit">Limit</option>
//         <option value="Market">Market</option>
//       </select>
//       <select {...register('side')} className="block w-full">
//         <option value="Buy">Buy</option>
//         <option value="Sell">Sell</option>
//       </select>
//       {showPrice && (
//         <input type="number" step="0.01" {...register('price')} placeholder="Price" className="block w-full" />
//       )}
//       <input type="number" step="0.0001" {...register('quantity')} placeholder="Quantity" className="block w-full" />
//       <select {...register('timing')} className="block w-full">
//         <option value="immediate">Immediate</option>
//         <option value="5s">5 seconds delay</option>
//         <option value="10s">10 seconds delay</option>
//         <option value="30s">30 seconds delay</option>
//       </select>
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2">Simulate Order</button>
//       {Object.entries(errors).map(([k, e]: any) => (
//         <p key={k} className="text-red-600">{e?.message}</p>
//       ))}
//     </form>
//   );
// }

'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useStore, { simulationStateType } from '../store/index';

// --- 1. Define Zod schema
const schema = z.object({
  venue: z.enum(['OKX', 'Bybit', 'Deribit']),
  symbol: z.string().nonempty({ message: 'Symbol is required' }),
  type: z.enum(['Limit', 'Market']),
  side: z.enum(['Buy', 'Sell']),
  price: z
    .preprocess((val) => {
      if (val === '' || val === undefined) return undefined;
      const parsed = parseFloat(val as string);
      return isNaN(parsed) ? undefined : parsed;
    }, z.number().positive({ message: 'Price must be positive' }))
    .optional(),
  quantity: z.preprocess((val) => parseFloat(val as string), z.number().positive({ message: 'Quantity must be positive' })),
  timing: z.enum(['immediate', '5s', '10s', '30s'])
}).refine((data) => data.type === 'Market' || data.price !== undefined, {
  message: 'Limit orders require price',
  path: ['price']
});

// --- 2. Infer TypeScript type
type FormInput = z.infer<typeof schema>;

export default function OrderSimulationForm() {
  const { setSimulation } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      venue: 'OKX',
      symbol: 'BTC-USDT',
      type: 'Limit',
      side: 'Buy',
      quantity: 1,
      timing: 'immediate',
      price: undefined
    }
  });

  // --- 3. Properly typed handler
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const timingMs = {
      immediate: 0,
      '5s': 5000,
      '10s': 10000,
      '30s': 30000
    }[data.timing];

    const sim: simulationStateType = {
      venue: data.venue,
      symbol: data.symbol,
      type: data.type,
      side: data.side,
      price: data.price,
      quantity: data.quantity,
      timingMs
    };

    setSimulation(sim);
  };

  const showPrice = watch('type') === 'Limit';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto  p-6 rounded shadow-md">
  {/* Venue */}
  <select {...register('venue')} className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">
    <option value="OKX">OKX</option>
    <option value="Bybit">Bybit</option>
    <option value="Deribit">Deribit</option>
  </select>

  {/* Symbol */}
  <input
    type="text"
    {...register('symbol')}
    placeholder="Symbol (e.g. BTC-USDT)"
    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.symbol && <p className="text-red-600 text-sm">{errors.symbol.message}</p>}

  {/* Order Type */}
  <select {...register('type')} className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">
    <option value="Limit">Limit</option>
    <option value="Market">Market</option>
  </select>

  {/* Side */}
  <select {...register('side')} className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">
    <option value="Buy">Buy</option>
    <option value="Sell">Sell</option>
  </select>

  {/* Price (shown only for Limit) */}
  {showPrice && (
    <input
      type="number"
      step="0.01"
      {...register('price')}
      placeholder="Price"
      className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )}
  {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}

  {/* Quantity */}
  <input
    type="number"
    step="0.0001"
    {...register('quantity')}
    placeholder="Quantity"
    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}

  {/* Timing */}
  <select {...register('timing')} className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black">
    <option value="immediate">Immediate</option>
    <option value="5s">5 seconds delay</option>
    <option value="10s">10 seconds delay</option>
    <option value="30s">30 seconds delay</option>
  </select>

  {/* Submit */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    Simulate Order
  </button>
</form>

  );
}
