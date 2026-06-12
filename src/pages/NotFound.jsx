import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/shared/SEO';

const floatingNumbers = [
  { value: '0', x: '10%', y: '15%', delay: 0 },
  { value: '1', x: '85%', y: '10%', delay: 0.3 },
  { value: '0', x: '75%', y: '80%', delay: 0.6 },
  { value: '1', x: '20%', y: '85%', delay: 0.9 },
  { value: '?', x: '50%', y: '5%', delay: 1.2 },
  { value: '!', x: '90%', y: '50%', delay: 1.5 },
  { value: '×', x: '5%',  y: '55%', delay: 1.8 },
  { value: '}', x: '45%', y: '92%', delay: 2.1 },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden flex items-center justify-center">
      <SEO
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        path="/404"
      />

      {floatingNumbers.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.06, 0.12, 0.06],
            scale: [1, 1.1, 1],
            y: [0, -15, 0],
          }}
          transition={{
            delay: item.delay,
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute font-sora font-bold text-[10rem] md:text-[16rem] text-emerald-500/10 select-none pointer-events-none"
          style={{ left: item.x, top: item.y }}
        >
          {item.value}
        </motion.span>
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1 className="font-sora font-extrabold text-[10rem] md:text-[16rem] leading-none tracking-tighter text-gradient-emerald select-none">
            404
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-sora text-2xl md:text-3xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-400 text-lg max-w-md mx-auto mb-10 leading-relaxed"
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist, has been moved,
          or the URL might be mistyped.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home} iconPosition="left">
              Back to Home
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="secondary" size="lg" icon={Search} iconPosition="left">
              Explore Projects
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-16"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs uppercase tracking-[0.2em] text-slate-600 font-medium">
              lost?
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 mt-6 text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
