import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rawFaqItems = t("faq.items", { returnObjects: true });
  const faqItems: FAQItem[] = Array.isArray(rawFaqItems) ? rawFaqItems : [];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-transparent overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
            style={{
              textShadow: "0 0 10px rgba(59, 201, 255, 0.5)",
            }}
          >
            FAQ
          </motion.span>

          {/* Title - H2 sizing: 24px → 44px (smaller than H1) */}
          <h2 className="text-2xl sm:text-[28px] md:text-[32px] lg:text-4xl xl:text-[40px] 2xl:text-[44px] font-extrabold text-white mb-4">
            {t("faq.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-cyan-400/30"
                style={{
                  background: 'linear-gradient(135deg, #0A0A0A 0%, #13151A 40%, #0f1114 70%, #0A0A0A 100%)',
                  boxShadow:
                    openIndex === index
                      ? "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 30px rgba(59, 201, 255, 0.1)"
                      : "inset 0 1px 0 0 rgba(255,255,255,0.03)",
                }}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className="text-white font-medium text-sm md:text-base pr-4">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    {openIndex === index ? (
                      <X className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/60" />
                    )}
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                        <p className="text-white/60 text-sm md:text-base leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
