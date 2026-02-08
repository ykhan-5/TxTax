import Link from "next/link";

export default function ResultsNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">
        ZIP Code Not Found
      </h1>
      <p className="text-lg text-charcoal/60 mb-8">
        That doesn&apos;t look like a valid Texas ZIP code. We only have data for
        Texas state spending.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-texas-blue text-white rounded-xl
          font-heading font-semibold hover:bg-texas-blue/90 transition-colors"
      >
        &larr; Try a different ZIP
      </Link>
    </div>
  );
}
