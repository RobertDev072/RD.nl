import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col items-start justify-center gap-6 pt-28">
      <p className="eyebrow">404</p>
      <h1 className="display text-[clamp(56px,9vw,140px)]">Deze pagina bestaat <span className="script text-[1.1em]">niet</span>.</h1>
      <Link href="/" className="btn-primary">Terug naar home</Link>
    </section>
  );
}
