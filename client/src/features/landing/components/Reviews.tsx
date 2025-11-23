import React from "react";
import { Star, Quote } from "../../../components/ui/Icons";

const REVIEWS = [
  {
    id: 1,
    name: "Alex M.",
    role: "Crypto Analyst",
    text: "The AI insights are scary good. It predicted the ETH dip perfectly. Finally a tool that actually gives me an edge.",
    stars: 5,
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Day Trader",
    text: "Finally a journal that looks like it belongs in 2024. Dark mode is perfection and the charts are incredibly smooth.",
    stars: 5,
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "James R.",
    role: "Portfolio Manager",
    text: "Bank-grade security was the selling point for me. Sleep easy knowing my data is encrypted and safe.",
    stars: 4,
    img: "https://i.pravatar.cc/150?img=60",
  },
];

export const Reviews: React.FC = () => {
  return (
    <div
      id="reviews"
      className="py-20 md:py-32 px-6 border-t border-white/5 relative overflow-hidden scroll-mt-20 bg-black"
    >
      {/* Subtle gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Trusted by <span className="text-neon-purple">Whales</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Join thousands of professional traders who rely on TradeLog daily.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col p-8 rounded-2xl bg-dark-card border border-white/10 hover:border-neon-purple/30 transition-all hover:-translate-y-1 group h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.stars)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              {/* Flex-grow to push footer to bottom */}
              <p className="text-gray-300 mb-8 text-lg leading-relaxed relative flex-grow">
                <Quote
                  size={40}
                  className="absolute -top-4 -left-4 text-white/5"
                />
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-xs text-neon-purple font-medium">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
