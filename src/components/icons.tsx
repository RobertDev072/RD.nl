import { AppWindow, Bot, Layers, Lightbulb, Monitor, Search, Server, Smartphone, Sparkles, type LucideProps } from 'lucide-react';
import type { IconName } from '@/lib/content';

const map = { monitor: Monitor, app: AppWindow, layers: Layers, phone: Smartphone, sparkles: Sparkles, search: Search, server: Server, bot: Bot, bulb: Lightbulb };

export function ServiceIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const I = map[name];
  return <I strokeWidth={1.7} aria-hidden {...props} />;
}
