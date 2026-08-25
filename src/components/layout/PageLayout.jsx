import { motion } from 'framer-motion';

export default function PageLayout({ title, subtitle, children, rightContent, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1680px] mx-auto ${className}`}
    >
      {/* Modern Responsive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5 sm:mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>

      {/* Main Page Content */}
      {children}
    </motion.div>
  );
}
