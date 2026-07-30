import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportReview } from '../redux/shopThunk';
import { toast } from 'sonner';
import Modal from '../../../components/ui/Modal';
import ActionButton from '../../../components/ui/ActionButton';

const ReportReviewModal = ({ isOpen, onClose, productId, reviewId, userName }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for reporting this review.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await dispatch(reportReview({ productId, reviewId, reason: reason.trim() })).unwrap();
      toast.success('Review reported for moderation');
      onClose();
      setReason('');
    } catch (err) {
      setError(err || 'Failed to report review');
      toast.error('Failed to report review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Report Review" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Reporting review by</p>
          <p className="font-bold text-foreground text-lg">{userName}</p>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Reason for reporting
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium transition-all resize-none"
            placeholder="Please explain why you are reporting this review..."
          ></textarea>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        
        <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row gap-3">
          <ActionButton
            text="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
            bgClass="bg-background"
            textClass="text-foreground"
            borderClass="border-border"
            hoverBgClass="bg-muted"
            showArrow={false}
            className="flex-1"
          />
          <ActionButton
            text={isSubmitting ? "Submitting..." : "Report"}
            type="submit"
            isLoading={isSubmitting}
            bgClass="bg-red-600"
            textClass="text-white"
            hoverBgClass="bg-red-500/20"
            showArrow={false}
            className="flex-1 shadow-lg shadow-red-600/25"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReportReviewModal;
