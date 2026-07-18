import { getAuthorInitials } from '../../utils/blogUtils';

export default function AuthorMeta({ author, authorRole, size = 'sm' }) {
  return (
    <div className="author-meta">
      <div className={`author-meta__avatar ${size === 'lg' ? 'author-meta__avatar--lg' : ''}`}>
        {getAuthorInitials(author)}
      </div>
      <div>
        <div className="author-meta__name">{author}</div>
        {authorRole && <div className="author-meta__role">{authorRole}</div>}
      </div>
    </div>
  );
}
