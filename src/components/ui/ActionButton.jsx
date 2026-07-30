import React from 'react';
import { motion } from 'framer-motion';
import { LuSave as Save, LuLoader as Loader2 } from 'react-icons/lu';

const ActionButton = ({ 
  text, 
  onClick,
  bgClass = "bg-red-600", 
  textClass = "text-white", 
  borderClass = "border-transparent",
  iconColor = "text-white",
  hoverBgClass = "bg-white/20",
  className = "",
  showArrow = true,
  icon: Icon = Save,
  type = "button",
  disabled = false,
  isLoading = false,
  iconAnimationDirection = "ttb",
  children
}) => {

  const isDisabled = disabled || isLoading;
  const baseClasses = `px-5 py-3 rounded-xl font-bold group relative border ${borderClass} ${bgClass} ${textClass} text-sm sm:text-base shadow-sm flex items-center justify-center transition-colors overflow-hidden isolate ${className} ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  const InnerContent = () => (
    <>
      {/* Expanding Drop Overlay */}
      <motion.div
        className={`absolute -bottom-8 -left-8 w-16 h-16 rounded-full ${hoverBgClass} pointer-events-none -z-10`}
        variants={{
          initial: { scale: 0 },
          hover: { scale: 12, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
        }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children || text}
      </span>
      
      {showArrow && Icon && !isLoading && (
        <motion.div
          variants={{
            initial: { width: 0, opacity: 0, y: -20, marginLeft: 0 },
            hover: { width: "auto", opacity: 1, y: 0, marginLeft: 6, transition: { type: "spring", stiffness: 300, damping: 20 } }
          }}
          className={`flex items-center ${iconColor} overflow-hidden relative z-10 transition-colors duration-300`}
        >
          <motion.div
            variants={{
              initial: { y: 20, opacity: 0, transition: { duration: 0.2 } },
              hover: { y: [-20, 0], opacity: [0, 1], transition: { duration: 0.3 } }
            }}
          >
            <Icon size={18} strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      )}
    </>
  );

  return (
    <motion.button 
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      initial="initial"
      whileHover={!isDisabled ? "hover" : "initial"}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={baseClasses}
    >
      <InnerContent />
    </motion.button>
  );
};

export default ActionButton;
