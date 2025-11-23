import React from "react";
import { Activity } from "./Icons";

const TICKER_ITEMS = [
  { symbol: "BTC", price: "64,231.40", change: "+1.2%" },
  { symbol: "ETH", price: "3,452.12", change: "-0.4%" },
  { symbol: "SOL", price: "145.60", change: "+5.7%" },
  { symbol: "BNB", price: "590.20", change: "+0.1%" },
  { symbol: "ADA", price: "0.45", change: "-1.2%" },
  { symbol: "XRP", price: "0.62", change: "+0.8%" },
  { symbol: "DOT", price: "7.30", change: "-2.1%" },
  { symbol: "LINK", price: "14.50", change: "+3.4%" },
];

const TickerItem: React.FC<{ item: (typeof TICKER_ITEMS)[0] }> = ({ item }) => (
  <div className="flex items-center space-x-3 px-12 text-base font-medium text-gray-400">
    <Activity className="w-4 h-4 text-neon-green" />
    <span className="text-white font-bold">{item.symbol}</span>
    <span>{item.price}</span>
    <span
      className={
        item.change.startsWith("+") ? "text-neon-green" : "text-red-500"
      }
    >
      {item.change}
    </span>
  </div>
);

export const Ticker: React.FC = () => {
  return (
    <div className="w-full bg-transparent border-y border-white/5 py-6 overflow-hidden relative z-20 backdrop-blur-sm">
      <div className="flex animate-scroll whitespace-nowrap w-max">
        {[
          ...TICKER_ITEMS,
          ...TICKER_ITEMS,
          ...TICKER_ITEMS,
          ...TICKER_ITEMS,
        ].map((item, idx) => (
          <TickerItem key={`${item.symbol}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
};
