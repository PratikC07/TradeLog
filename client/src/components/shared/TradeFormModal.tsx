import React from "react";
import { createPortal } from "react-dom";
import { X } from "../ui/Icons";
import { Trade } from "../../types/api";
import {
  CreateTradeDTO,
  UpdateTradeDTO,
  CloseTradeDTO,
} from "../../features/dashboard/api/dashboardService";

export type ModalMode = "ADD" | "EDIT" | "CLOSE" | "NONE";

interface TradeFormModalProps {
  mode: ModalMode;
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: ModalMode, data: any) => Promise<void>;
  error: string | null;
}

const getCurrentDateTime = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
};

export const TradeFormModal: React.FC<TradeFormModalProps> = ({
  mode,
  trade,
  isOpen,
  onClose,
  onSubmit,
  error,
}) => {
  if (!isOpen || mode === "NONE") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // ... (Keep existing logic for payload creation) ...
    if (mode === "ADD") {
      const payload: CreateTradeDTO = {
        symbol: formData.get("symbol") as string,
        side: formData.get("side") as "LONG" | "SHORT",
        quantity: parseFloat(formData.get("quantity") as string),
        entry_price: parseFloat(formData.get("entry_price") as string),
        entry_date: (formData.get("entry_date") as string) || undefined,
      };
      onSubmit("ADD", payload);
    } else if (mode === "EDIT") {
      const payload: UpdateTradeDTO = {
        symbol: formData.get("symbol") as string,
        side: formData.get("side") as "LONG" | "SHORT",
        quantity: parseFloat(formData.get("quantity") as string),
        entry_price: parseFloat(formData.get("entry_price") as string),
        entry_date: formData.get("entry_date") as string,
      };
      if (formData.get("exit_price")) {
        payload.exit_price = parseFloat(formData.get("exit_price") as string);
        payload.exit_date = formData.get("exit_date") as string;
      }
      onSubmit("EDIT", payload);
    } else if (mode === "CLOSE") {
      const payload: CloseTradeDTO = {
        exit_price: parseFloat(formData.get("exit_price") as string),
        exit_date: (formData.get("exit_date") as string) || undefined,
      };
      onSubmit("CLOSE", payload);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 w-screen h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {mode === "ADD"
              ? "New Trade Entry"
              : mode === "EDIT"
              ? "Edit Trade"
              : "Close Position"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (Keep Form Fields Exactly the Same as Previous) ... */}
          {mode === "CLOSE" ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Exit Price
                </label>
                <input
                  type="number"
                  step="any"
                  name="exit_price"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Exit Date
                </label>
                <input
                  type="datetime-local"
                  name="exit_date"
                  defaultValue={getCurrentDateTime()}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none [color-scheme:dark]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Symbol
                  </label>
                  <input
                    defaultValue={trade?.symbol}
                    type="text"
                    name="symbol"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none"
                    placeholder="BTC/USD"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Side
                  </label>
                  <div className="relative">
                    <select
                      defaultValue={trade?.side || "LONG"}
                      name="side"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none appearance-none pr-10"
                    >
                      <option value="LONG">LONG</option>
                      <option value="SHORT">SHORT</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Quantity
                  </label>
                  <input
                    defaultValue={trade?.quantity}
                    type="number"
                    step="any"
                    name="quantity"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Entry Price
                  </label>
                  <input
                    defaultValue={trade?.entry_price}
                    type="number"
                    step="any"
                    name="entry_price"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Entry Date
                </label>
                <input
                  type="datetime-local"
                  name="entry_date"
                  defaultValue={
                    trade?.entry_date
                      ? new Date(trade.entry_date).toISOString().slice(0, 16)
                      : getCurrentDateTime()
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none [color-scheme:dark]"
                />
              </div>
              {mode === "EDIT" && trade?.status === "CLOSED" && (
                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Exit Price
                      </label>
                      <input
                        defaultValue={trade?.exit_price || ""}
                        type="number"
                        step="any"
                        name="exit_price"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Exit Date
                      </label>
                      <input
                        type="datetime-local"
                        name="exit_date"
                        defaultValue={
                          trade?.exit_date
                            ? new Date(trade.exit_date)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-neon-green hover:bg-[#b3e600] text-black font-bold rounded-lg mt-4 transition-colors"
          >
            {mode === "ADD"
              ? "Execute Trade"
              : mode === "CLOSE"
              ? "Confirm Close"
              : "Update Trade"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
