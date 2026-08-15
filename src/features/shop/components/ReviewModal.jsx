import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, deleteReview } from '../redux/shopThunk';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'sonner';
import Modal from '../../../components/ui/Modal';
import ActionButton from '../../../components/ui/ActionButton';

const ReviewModal = ({ isOpen, onClose, orderId, productId, productName, existingReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.shop.reviews);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || '');
    } else if (isOpen) {
      setRating(0);
      setComment('');
    }
  }, [isOpen, existingReview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }

    try {
      const reviewData = {
        orderId: existingReview?.orderId || orderId,
        reviewId: existingReview?.id,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        rating,
        comment
      };
      
      const result = await dispatch(submitReview({ productId, reviewData })).unwrap();
      toast.success('Review submitted successfully!');
      onClose();
      setRating(0);
      setComment('');
      setError(null);
    } catch (err) {
      setError(err || 'Failed to submit review');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await dispatch(deleteReview({ productId, reviewId: existingReview.id })).unwrap();
        toast.success('Review deleted successfully!');
        onClose();
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingReview ? "Edit Review" : "Rate Product"} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Product</p>
          <p className="font-bold text-foreground text-lg">{productName}</p>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Rating
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  {filled
                    ? <FaStar className="w-9 h-9 text-amber-400 transition-colors" style={{ fontSize: '2.25rem' }} />
                    : <FaRegStar className="w-9 h-9 text-muted-foreground/40 transition-colors" style={{ fontSize: '2.25rem' }} />
                  }
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-[#8E5A45] focus:outline-none focus:ring-2 focus:ring-[#8E5A45]/20 text-sm font-medium transition-all resize-none"
            placeholder="What did you think about this product?"
          ></textarea>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        
        <div className="pt-4 border-t border-border flex flex-wrap sm:flex-nowrap gap-3">
          {existingReview && (
            <ActionButton
              text="Delete"
              type="button"
              onClick={handleDelete}
              bgClass="bg-red-500/10"
              textClass="text-red-600 dark:text-red-400"
              borderClass="border-red-500/20"
              hoverBgClass="bg-red-500/20"
              showArrow={false}
              className="w-full sm:w-auto flex-none px-4"
            />
          )}
          <ActionButton
            text="Cancel"
            type="button"
            onClick={onClose}
            bgClass="bg-background"
            textClass="text-foreground"
            borderClass="border-border"
            hoverBgClass="bg-muted"
            showArrow={false}
            className="flex-1"
          />
          <ActionButton
            text={loading ? "Submitting..." : "Submit Review"}
            type="submit"
            isLoading={loading}
            bgClass="bg-[#8E5A45]"
            textClass="text-white"
            hoverBgClass="bg-[#7A4D3B]/50"
            showArrow={false}
            className="flex-[2] shadow-lg shadow-[#8E5A45]/25"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
