import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Trade } from "../../types/api";
import { ArrowUpRight } from "../ui/Icons";

// --- Helper Icons & Menu ---
const MoreVertical = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const Edit = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const Trash = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const XCircle = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const ActionMenu: React.FC<{
  trade: Trade;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ trade, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsOpen(false);
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 5,
        left: rect.right + window.scrollX - 140,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
          isOpen ? "text-white bg-white/10" : "text-gray-400 hover:text-white"
        }`}
      >
        <MoreVertical size={18} />
      </button>
      {isOpen &&
        createPortal(
          <div
            className="fixed z-[9999] w-[140px] bg-[#111] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ top: coords.top, left: coords.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 flex items-center gap-2 text-gray-300 hover:text-neon-blue transition-colors"
            >
              <Edit /> Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-500/10 flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash /> Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

// --- Table Component ---
interface TradesTableProps {
  trades: Trade[];
  isAdmin: boolean;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onClosePosition: (trade: Trade) => void;
  title?: string;
  hideExitColumns?: boolean;
  showViewAll?: boolean;
  isLoading?: boolean;
}

export const TradesTable: React.FC<TradesTableProps> = ({
  trades,
  isAdmin,
  onEdit,
  onDelete,
  onClosePosition,
  title,
  hideExitColumns = false,
  showViewAll = true,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const MIN_ROWS = 4;
  const emptyRows = Math.max(0, MIN_ROWS - trades.length);
  // Column Count: Admin (7) vs Trader (8)
  // Admin: Trader(1) + Symbol(1) + Side(1) + Qty(1) + Entry(1) + [Exit/PnL(2)] + Status(1) + Actions(0)
  const colCount =
    (isAdmin ? 1 : 0) + 4 + (hideExitColumns ? 0 : 2) + 1 + (isAdmin ? 0 : 1);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableScrollRef.current)
      tableScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }, [title]);

  const getInitials = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="rounded-2xl bg-dark-card border border-white/5 overflow-hidden flex flex-col h-full shadow-xl relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-card/80 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-neon-green/20 border-t-neon-green rounded-full animate-spin shadow-[0_0_20px_rgba(204,255,0,0.2)]"></div>
            <span className="text-xs font-bold text-neon-green tracking-widest animate-pulse">
              LOADING
            </span>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-neon-green rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight uppercase">
            {title || (isAdmin ? "Global Top Trades" : "Recent Trades")}
          </h2>
          {!isLoading && (
            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-500 border border-white/5 hidden sm:inline-block">
              {trades.length} RECORDS
            </span>
          )}
        </div>
        {!isAdmin && showViewAll && trades.length > 0 && (
          <button
            onClick={() => navigate("/journal")}
            className="text-sm text-neon-green hover:text-[#b3e600] transition-colors flex items-center gap-1 font-medium"
          >
            View All <ArrowUpRight size={16} />
          </button>
        )}
      </div>

      <div
        ref={tableScrollRef}
        className="flex-1 h-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative"
      >
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold sticky top-0 z-10 backdrop-blur-sm border-b border-white/5">
            <tr>
              {/* ADMIN: Trader Column (First) */}
              {isAdmin && (
                <th className="px-6 py-4 min-w-[200px] border-r border-white/5">
                  Trader
                </th>
              )}

              <th className="px-6 py-4 min-w-[120px] border-r border-white/5">
                Symbol
              </th>
              <th className="px-6 py-4 min-w-[100px] text-center border-r border-white/5">
                Side
              </th>
              <th className="px-6 py-4 min-w-[100px] text-right border-r border-white/5">
                Qty
              </th>
              <th className="px-6 py-4 min-w-[140px] text-right border-r border-white/5">
                Entry
              </th>
              {!hideExitColumns && (
                <>
                  <th className="px-6 py-4 min-w-[140px] text-right border-r border-white/5">
                    Exit
                  </th>
                  <th className="px-6 py-4 min-w-[120px] text-right border-r border-white/5">
                    PnL
                  </th>
                </>
              )}
              {/* STATUS: Visible for both (Journal requires status) */}
              <th className="px-6 py-4 min-w-[120px] text-center border-r border-white/5">
                Status
              </th>

              {/* ACTIONS: Hidden for Admin */}
              {!isAdmin && (
                <th className="px-6 py-4 w-[160px] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm relative">
            {!isLoading &&
              trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="hover:bg-white/[0.02] transition-colors group h-[60px]"
                >
                  {/* ADMIN: Trader Info (Light Green Circle, Black Text) */}
                  {isAdmin && (
                    <td className="px-6 py-2 border-r border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center shadow-lg border border-black/10 shrink-0">
                          <span className="text-sm font-bold text-black">
                            {getInitials(trade.owner?.username || "?")}
                          </span>
                        </div>
                        <div
                          className="font-medium text-white truncate max-w-[140px]"
                          title={trade.owner?.username}
                        >
                          {trade.owner?.username || "Unknown"}
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 font-bold text-white border-r border-white/5">
                    {trade.symbol}
                  </td>
                  <td className="px-6 py-4 text-center border-r border-white/5">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${
                        trade.side === "LONG"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300 font-mono border-r border-white/5">
                    {trade.quantity}
                  </td>
                  <td className="px-6 py-4 text-right border-r border-white/5">
                    <div className="text-gray-200 font-mono">
                      ${trade.entry_price.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(trade.entry_date).toLocaleDateString()}
                    </div>
                  </td>
                  {!hideExitColumns && (
                    <>
                      <td className="px-6 py-4 text-right border-r border-white/5">
                        {trade.exit_price ? (
                          <div className="text-gray-200 font-mono">
                            ${trade.exit_price.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-mono font-bold border-r border-white/5 ${
                          trade.pnl && trade.pnl > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {trade.pnl
                          ? trade.pnl > 0
                            ? `+$${trade.pnl.toLocaleString()}`
                            : `-$${Math.abs(trade.pnl).toLocaleString()}`
                          : "-"}
                      </td>
                    </>
                  )}

                  {/* STATUS: Visible for All */}
                  <td className="px-6 py-4 text-center border-r border-white/5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        trade.status === "OPEN"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {trade.status === "OPEN" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                      {trade.status}
                    </span>
                  </td>

                  {/* ACTIONS: Hidden for Admin */}
                  {!isAdmin && (
                    <td className="px-6 py-4 text-right w-[160px]">
                      <div className="flex items-center justify-end gap-2 h-8">
                        {trade.status === "OPEN" ? (
                          <button
                            onClick={() => onClosePosition(trade)}
                            className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                          >
                            <XCircle size={12} /> Close
                          </button>
                        ) : (
                          <div className="w-[68px]"></div>
                        )}
                        <div className="w-px h-4 bg-white/10 mx-1"></div>
                        <ActionMenu
                          trade={trade}
                          onEdit={() => onEdit(trade)}
                          onDelete={() => onDelete(trade.id)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            {!isLoading &&
              emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-[60px]">
                  <td
                    colSpan={colCount}
                    className="border-r border-white/5 bg-white/[0.005]"
                  ></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
