'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return <button onClick={() => window.print()} className="btn-accent"><Printer size={17} /> Printen</button>;
}
