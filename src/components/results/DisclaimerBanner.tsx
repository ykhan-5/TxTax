import Link from "next/link";

interface DisclaimerBannerProps {
  disclaimer: string;
  dataSource: string;
}

export function DisclaimerBanner({ disclaimer, dataSource }: DisclaimerBannerProps) {
  return (
    <div className="bg-texas-blue/5 rounded-xl px-5 py-4 text-sm text-charcoal/60">
      <p>
        <strong className="text-charcoal/70">Note:</strong> {disclaimer}
      </p>
      <p className="mt-1">
        Data source: {dataSource}.{" "}
        <Link href="/about" className="underline hover:text-texas-blue transition-colors">
          Read our methodology
        </Link>
      </p>
    </div>
  );
}
