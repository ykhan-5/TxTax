import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology — TxTax",
  description: "How we calculate your estimated Texas state tax contribution.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-8">
        Methodology
      </h1>

      <div className="space-y-8 text-charcoal/80 leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            How We Calculate Your Tax Estimate
          </h2>
          <p>
            We estimate your per-person state tax contribution using publicly
            available data from the Texas Comptroller of Public Accounts and the
            U.S. Census Bureau. Here&apos;s the formula:
          </p>
          <ol className="list-decimal list-inside mt-3 space-y-2">
            <li>Look up your ZIP code&apos;s county</li>
            <li>Get total state spending in that county from Comptroller data</li>
            <li>Divide by county population (Census ACS 5-year estimates)</li>
            <li>
              Adjust based on your ZIP code&apos;s median household income
              relative to the state median
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Data Sources
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <a
                href="https://data.texas.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-texas-blue"
              >
                Texas Open Data Portal
              </a>{" "}
              &mdash; State expenditures by county
            </li>
            <li>
              <a
                href="https://www.census.gov/data/developers.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-texas-blue"
              >
                U.S. Census Bureau ACS 5-Year
              </a>{" "}
              &mdash; Population and income by county/ZIP
            </li>
            <li>
              <a
                href="https://www.huduser.gov/portal/datasets/usps_crosswalk.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-texas-blue"
              >
                HUD USPS Crosswalk
              </a>{" "}
              &mdash; ZIP code to county mapping
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Important Disclaimers
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Tax estimates are based on <strong>county-level averages</strong>{" "}
              and may not reflect your individual tax burden.
            </li>
            <li>
              Actual tax contributions depend on personal income, spending
              habits, property ownership, and other factors.
            </li>
            <li>
              Spending categories are approximated by mapping state agency
              expenditures to functional categories. Some classification
              judgment is involved.
            </li>
            <li>
              This site is <strong>not affiliated</strong> with the State of
              Texas or any government agency.
            </li>
            <li>
              The &ldquo;weird &amp; specific items&rdquo; are illustrative
              calculations based on publicly available cost averages. They are
              meant to make the data relatable, not to be taken as exact
              accounting.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Political Neutrality
          </h2>
          <p>
            TxTax presents data without editorial commentary. We do not label
            any spending as &ldquo;wasteful&rdquo; or &ldquo;essential.&rdquo;
            Our goal is to make public spending data accessible and personal.
            You draw your own conclusions.
          </p>
        </section>
      </div>
    </div>
  );
}
