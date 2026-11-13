import { Suspense } from 'react';
import Catalog from './Catalog';
export const metadata = { title: 'Shop · BellaMina' };
export default function Page() { return <Suspense><Catalog /></Suspense>; }
