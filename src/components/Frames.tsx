import Image from 'next/image';

export function BrowserFrame({ src, alt, url, priority = false, className = '' }: { src: string; alt: string; url: string; priority?: boolean; className?: string }) {
  return (
    <div className={'overflow-hidden rounded-[18px] border border-black/[.06] bg-white shadow-[0_40px_90px_-40px_rgba(10,10,10,.55)] ' + className}>
      <div className="flex h-9 items-center gap-3 border-b border-line bg-[#f7f8fa] px-3.5">
        <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-soft">{url}</span>
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={alt} fill quality={90} sizes="(max-width: 900px) 100vw, 70vw" className="object-cover object-top" priority={priority} />
      </div>
    </div>
  );
}

export function ScreenCard({ src, alt, className = '', priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={'relative overflow-hidden rounded-[26px] border-[5px] border-white bg-white shadow-[0_30px_70px_-28px_rgba(10,10,10,.6)] ring-1 ring-black/[.06] ' + className}>
      <div className="relative aspect-[9/19.5]">
        <Image src={src} alt={alt} fill quality={90} sizes="(max-width: 900px) 45vw, 340px" className="object-cover object-top" priority={priority} />
      </div>
    </div>
  );
}
