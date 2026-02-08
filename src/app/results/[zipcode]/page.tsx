import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isTexasZip } from "@/lib/utils/validation";
import { formatCurrency } from "@/lib/utils/format";
import { calculateSpending } from "@/lib/calculations/per-capita";
import { TaxBurdenHeader } from "@/components/results/TaxBurdenHeader";
import { SpendingBarChart } from "@/components/results/SpendingBarChart";
import { WeirdItems } from "@/components/results/WeirdItems";
import { CategoryBreakdown } from "@/components/results/CategoryBreakdown";
import { DisclaimerBanner } from "@/components/results/DisclaimerBanner";
import { ShareSection } from "@/components/results/ShareSection";
import { CountyMap } from "@/components/results/CountyMap";

interface ResultsPageProps {
  params: Promise<{ zipcode: string }>;
}

async function getData(zipcode: string) {
  if (!isTexasZip(zipcode)) return null;
  try {
    return await calculateSpending(zipcode);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ResultsPageProps): Promise<Metadata> {
  const { zipcode } = await params;
  const data = await getData(zipcode);
  if (!data) {
    return { title: "ZIP Not Found | TxTax" };
  }
  return {
    title: `ZIP ${zipcode} — ${formatCurrency(data.estimatedPerCapitaTax)} in Texas Taxes | TxTax`,
    description: `Residents of ZIP ${zipcode} (${data.countyName} County) paid an estimated ${formatCurrency(data.estimatedPerCapitaTax)} per person in Texas state taxes in FY${data.fiscalYear}.`,
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { zipcode } = await params;

  const data = await getData(zipcode);
  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <DisclaimerBanner
        disclaimer={data.metadata.disclaimer}
        dataSource={data.metadata.dataSource}
      />

      <TaxBurdenHeader
        zipCode={data.zipCode}
        countyName={data.countyName}
        fiscalYear={data.fiscalYear}
        estimatedPerCapitaTax={data.estimatedPerCapitaTax}
      />

      <SpendingBarChart categories={data.categories} />

      <WeirdItems items={data.weirdItems} />

      <CategoryBreakdown categories={data.categories} />

      <CountyMap
        countyName={data.countyName}
        totalCountySpending={data.totalCountySpending}
        countyFips={data.countyFips}
      />

      <ShareSection
        zipCode={data.zipCode}
        countyName={data.countyName}
        estimatedPerCapitaTax={data.estimatedPerCapitaTax}
        topCategory={data.categories[0]}
      />
    </div>
  );
}
