import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge';

const API_URL = import.meta.env.VITE_API_URL || '';

const categoryConfig = {
  website: { label: 'Website', color: 'primary' },
  android: { label: 'Android', color: 'accent' },
  video: { label: 'Video', color: 'warning' },
  design: { label: 'Design', color: 'success' },
};
export default function ProjectCard({ project, index = 0 }) {
  const cat = categoryConfig[project.category] || categoryConfig.website;
  const thumbnail = project.thumbnail
    ? `${API_URL}/storage/${project.thumbnail}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group block rounded-2xl overflow-hidden card-hover"
      >
        
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-4xl opacity-30">🖼️</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-4 right-4">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={cat.color}>{cat.label}</Badge>
          </div>

          {/* Featured badge */}
          {project.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="primary" dot>Featured</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 bg-gray-900/50 glass border-t-0 rounded-b-2xl">
          <h3 className="font-sora font-bold text-white text-lg mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.short_description || project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-[11px] text-slate-600 px-1">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
