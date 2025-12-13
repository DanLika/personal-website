import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import { useSpotlight } from "../../hooks/useSpotlight";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const Contact = () => {
  const { t } = useTranslation();
  const { handleMouseMove, handleTouchMove, cleanup } = useSpotlight();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Show success state
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/DanLika'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/dusko-licanin-7b2705254/'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:duskolicanin1234@gmail.com'
    }
  ];

  return (
    <section id="contact" className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden bg-transparent">

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto group">
        {/* Spotlight Effect Container */}
        <div className="relative">
          {/* Outer spotlight glow that follows mouse */}
          <div
            className="absolute -inset-[2px] rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
              filter: 'blur(30px)'
            }}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden transition-all duration-500"
            style={{
              background: 'linear-gradient(to bottom right, rgba(6,182,212,0.05), transparent, rgba(59,130,246,0.05)), rgba(0,0,0,0.4)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >

          {/* Content Grid */}
          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 p-6 md:p-12 lg:p-16">

            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl sm:text-[28px] md:text-[32px] lg:text-4xl xl:text-[40px] 2xl:text-[44px] font-bold font-space text-white leading-tight line-clamp-2"
              >
                {t("contact.title")}
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed"
              >
                {t("contact.subtitle")}
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-white/50 text-sm font-medium tracking-wider uppercase">
                  {t("about.connect")}
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${social.name}${social.name === 'Email' ? '' : ' profile'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.6 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{
                          scale: 1.1
                        }}
                        className="w-14 h-14 rounded-xl border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-center transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(59,201,255,0.5)] group"
                      >
                        <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" aria-hidden="true" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label htmlFor="name" className="block text-white/60 text-sm font-medium mb-2">
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#13151A] border border-white/10 rounded-xl text-white placeholder-white/40 transition-all duration-300 focus:border-[#3BC9FF] focus:shadow-[0_0_15px_rgba(59,201,255,0.3)] focus:outline-none"
                    placeholder={t("contact.form.name")}
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <label htmlFor="email" className="block text-white/60 text-sm font-medium mb-2">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#13151A] border border-white/10 rounded-xl text-white placeholder-white/40 transition-all duration-300 focus:border-[#3BC9FF] focus:shadow-[0_0_15px_rgba(59,201,255,0.3)] focus:outline-none"
                    placeholder={t("contact.form.email")}
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <label htmlFor="message" className="block text-white/60 text-sm font-medium mb-2">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[#13151A] border border-white/10 rounded-xl text-white placeholder-white/40 transition-all duration-300 focus:border-[#3BC9FF] focus:shadow-[0_0_15px_rgba(59,201,255,0.3)] focus:outline-none resize-none"
                    placeholder={t("contact.form.message")}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <motion.button
                    type="submit"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-6 py-3 rounded-full transition-all duration-300 ${isSubmitted
                      ? 'bg-green-500/20 border-green-400/40 backdrop-blur-sm border'
                      : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60'
                      } flex items-center justify-center gap-2`}
                  >
                    {isSubmitted ? (
                      <>
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 text-sm font-semibold">Message Sent!</span>
                      </>
                    ) : (
                      <span className="text-cyan-400 text-sm font-semibold">{t("contact.form.send")}</span>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>

          {/* Glass Border Highlight - Removed border-image due to rendering issues */}
        </motion.div>
        </div>
      </div>
    </section>
  );
};
