import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-5">
          {/* Top row: brand + icons */}
          <div className="flex items-center gap-4">
            <span className="font-heading font-bold text-texas-blue">TxTax</span>
            <span className="text-charcoal/30">&middot;</span>
            {/* GitHub */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-charcoal transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {/* Personal Website */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-charcoal transition-colors"
              aria-label="Personal website"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-.778.099-1.533.284-2.253" />
              </svg>
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-charcoal/50">
            <Link href="/about" className="hover:text-texas-blue transition-colors">
              Methodology
            </Link>
            <span className="text-charcoal/20">&middot;</span>
            <a
              href="https://comptroller.texas.gov/transparency/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-texas-blue transition-colors"
            >
              Data: Texas Comptroller
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-charcoal/35 text-center max-w-md leading-relaxed">
            Tax estimates are based on county-level averages and may not reflect
            individual tax burden. Not affiliated with the State of Texas.
          </p>
        </div>
      </div>
    </footer>
  );
}
