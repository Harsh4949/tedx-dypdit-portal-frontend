import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function UploadGuideModal() {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  return (
    <>
      {/* Trigger Link */}
      <span
        onClick={handleClick}
        className="text-xs text-[#D4AF37] underline cursor-pointer hover:text-[#FFD700] transition"
      >
        Learn how to upload
      </span>

      {/* Modal Overlay */}
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black border border-[#D4AF37] rounded-xl p-6 max-w-sm w-full text-white shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              <h2 className="text-xl font-semibold text-[#D4AF37] mb-2 tracking-wide">
                Every Scar Has a Story
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Please upload a <span className="text-[#FFD700] font-medium">clear screenshot</span> of your payment confirmation.
                Ensure the <span className="text-[#FFD700]">reference number</span>, amount, and time are visible.
              </p>
              <div className="mt-4 text-xs text-gray-500 italic">
                "Let the cracks tell your truth. Let your story shine."
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
