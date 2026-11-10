import { Icon } from './icons';
export default function Reviews({ items, grid }) {
  return (
    <div className={grid ? 'rgrid' : 'rrail'}>
      {items.map(([n, t]) => (
        <figure className="rcard" key={n}>
          <span className="stars">{[1, 2, 3, 4, 5].map(i => <span key={i}>{Icon.star(14)}</span>)}</span>
          <blockquote>“{t}”</blockquote>
          <figcaption>{n} <small>via Facebook</small></figcaption>
        </figure>
      ))}
    </div>
  );
}
