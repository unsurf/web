import type { Metadata } from "next";
import Link from "next/link";
import { NOT_FOUND_CONFIG as C } from "./not-found.config";

export const metadata: Metadata = { title: C.title, alternates: { canonical: null }, robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col justify-end gap-8 px-6 pb-[14vh] md:px-10">
      <p className={`m-0 ${C.fontClass} text-xs uppercase tracking-[0.2em] text-white/60`}>{C.code}</p>
      <h1 className={`m-0 max-w-[14ch] ${C.fontClass} text-[clamp(2.4rem,9vw,8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white`}>
        {C.title}
      </h1>
      <Link
        href="/"
        className={`group relative w-fit overflow-hidden border border-white/40 px-6 py-3 ${C.fontClass} text-xs uppercase tracking-[0.2em] text-white outline-none transition-colors duration-500 focus-visible:ring-1 focus-visible:ring-white`}
      >
        <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--accent)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
        <span className="relative transition-colors duration-500 group-hover:text-black group-focus-visible:text-black">{C.cta}</span>
      </Link>
    </div>
  );
}
