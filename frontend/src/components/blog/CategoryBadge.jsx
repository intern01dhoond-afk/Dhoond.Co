import { ArrowRight } from 'lucide-react';

export default function CategoryBadge({ children, className = '' }) {
  return <span className={`category-badge ${className}`.trim()}>{children}</span>;
}

export function ReadMoreLink({ label = 'Read Blog', size = 14 }) {
  return (
    <span className="read-link">
      {label} <ArrowRight size={size} aria-hidden="true" />
    </span>
  );
}
