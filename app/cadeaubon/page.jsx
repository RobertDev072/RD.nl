import Link from 'next/link';
import Gift from './Gift';
export const metadata = { title: 'Cadeaubon' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Cadeaubon</span></nav>
      <Gift />
    </div>
  );
}
