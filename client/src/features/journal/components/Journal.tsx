import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { TradesTable } from "../../../components/shared/TradesTable";
import { DeleteModal } from "../../dashboard/components/DeleteModal";
import {
  TradeFormModal,
  ModalMode,
} from "../../../components/shared/TradeFormModal";
import { Plus, ChevronLeft, ChevronRight } from "../../../components/ui/Icons";
import { useJournal } from "../hooks/useJournal";
import { Trade, UserProfile } from "../../../types/api";

export const Journal: React.FC = () => {
  const {
    trades,
    loading,
    total,
    page,
    filter,
    setFilter,
    handlePageChange,
    handleMutation,
    handleDelete,
    LIMIT,
  } = useJournal();

  const { user } = useOutletContext<{ user: UserProfile }>();

  // Robust Admin Check
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [modalMode, setModalMode] = useState<ModalMode>("NONE");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const onFormSubmit = async (mode: ModalMode, data: any) => {
    const success = await handleMutation(mode, selectedTrade?.id || null, data);
    if (success) {
      setModalMode("NONE");
      setFormError(null);
    } else {
      setFormError("Operation failed. Please check fields.");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);
  const activeToggleClass =
    "bg-neon-green/10 text-neon-green border border-neon-green/20 shadow-[0_0_15px_rgba(204,255,0,0.15)]";
  const inactiveToggleClass =
    "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent";

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 shrink-0">
          {/* Filter Toggles */}
          <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/5 w-full md:w-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex-1 md:flex-none px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                filter === "ALL" ? activeToggleClass : inactiveToggleClass
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilter("OPEN")}
              className={`flex-1 md:flex-none px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                filter === "OPEN" ? activeToggleClass : inactiveToggleClass
              }`}
            >
              OPEN
            </button>
          </div>

          {/* Add Button - HIDDEN FOR ADMIN */}
          {!isAdmin && (
            <button
              onClick={() => {
                setSelectedTrade(null);
                setModalMode("ADD");
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black font-bold rounded-xl hover:bg-[#b3e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] w-full md:w-auto justify-center"
            >
              <Plus size={18} /> Add Trade
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="flex-1 bg-dark-card border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-xl relative min-h-0">
          <div className="flex-1 overflow-hidden" ref={tableContainerRef}>
            <TradesTable
              trades={trades}
              isAdmin={isAdmin} // Pass isAdmin to control columns
              title={
                filter === "ALL"
                  ? isAdmin
                    ? "GLOBAL JOURNAL"
                    : "TRADE HISTORY"
                  : "ACTIVE POSITIONS"
              }
              hideExitColumns={filter === "OPEN"}
              showViewAll={false}
              isLoading={loading}
              onEdit={(t) => {
                setSelectedTrade(t);
                setModalMode("EDIT");
              }}
              onDelete={(id) => setDeleteId(id)}
              onClosePosition={(t) => {
                setSelectedTrade(t);
                setModalMode("CLOSE");
              }}
            />
          </div>

          {/* Pagination */}
          <div className="h-16 border-t border-white/5 bg-black/20 flex items-center justify-between px-6 shrink-0">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="text-white font-mono">{trades.length}</span> of{" "}
              <span className="text-white font-mono">{total}</span> trades
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-mono text-gray-400 px-2">
                Page {page} / {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TradeFormModal
        isOpen={modalMode !== "NONE"}
        mode={modalMode}
        trade={selectedTrade}
        onClose={() => {
          setModalMode("NONE");
          setFormError(null);
        }}
        onSubmit={onFormSubmit}
        error={formError}
      />
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId);
            setDeleteId(null);
          }
        }}
        isDeleting={loading}
      />
    </>
  );
};
