import React, { useState, useEffect } from 'react';
import { LuOctagonAlert as AlertIcon, LuX as X, LuCheck as Check } from 'react-icons/lu';
import Modal from '../../../components/ui/Modal';
import ActionButton from '../../../components/ui/ActionButton';

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Delivery time is too long",
  "Need to change delivery address",
  "Other reason"
];

export default function CancelOrderModal({ isOpen, onClose, onConfirm, orderId, loading }) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason(CANCEL_REASONS[0]);
      setCustomReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other reason" && customReason.trim()
      ? `Other: ${customReason.trim()}`
      : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showHeader={false} maxWidth="max-w-md">
      {/* Top Header / Close button */}
      <div className="flex items-center justify-between p-6 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
          Cancellation Confirmation
        </span>
        <button
          onClick={onClose}
          disabled={loading}
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 pt-2 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center ring-1 ring-red-500/20 shadow-inner mb-2">
            <AlertIcon className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-outfit">
            Cancel Order #{orderId?.slice(0, 8).toUpperCase()}?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to cancel this order? This action is permanent and cannot be undone once confirmed.
          </p>
        </div>

        {/* Reason Selection */}
        <div className="space-y-3 pt-2 border-t border-border">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Please select a reason
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {CANCEL_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedReason(reason)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 font-bold'
                      : 'bg-background border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{reason}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedReason === "Other reason" && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                placeholder="Tell us why you are cancelling..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer / Buttons */}
      <div className="p-6 bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row gap-3">
        <ActionButton
          text="Keep Order"
          onClick={onClose}
          disabled={loading}
          bgClass="bg-background"
          textClass="text-foreground"
          borderClass="border-border"
          hoverBgClass="bg-muted"
          showArrow={false}
          className="flex-1"
        />
        <ActionButton
          text={loading ? "Cancelling..." : "Yes, Cancel Order"}
          onClick={handleConfirm}
          isLoading={loading}
          bgClass="bg-red-600"
          textClass="text-white"
          hoverBgClass="bg-red-500/20"
          showArrow={false}
          className="flex-1 shadow-lg shadow-red-600/25"
        />
      </div>
    </Modal>
  );
}
