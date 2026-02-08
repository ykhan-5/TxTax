import { ImageResponse } from "next/og";
import { isTexasZip } from "@/lib/utils/validation";
import { calculateSpending } from "@/lib/calculations/per-capita";

export const runtime = "nodejs";
export const alt = "TxTax - Texas Tax Breakdown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ zipcode: string }>;
}) {
  const { zipcode } = await params;

  let title = "TxTax";
  let subtitle = "See where your Texas tax dollars went";
  let amount = "";
  let county = "";
  const bars: { label: string; pct: number; color: string }[] = [];

  if (isTexasZip(zipcode)) {
    try {
      const data = await calculateSpending(zipcode);
      if (data) {
        title = `ZIP ${data.zipCode}`;
        subtitle = `${data.countyName} County, Texas — FY${data.fiscalYear}`;
        amount = `$${data.estimatedPerCapitaTax.toLocaleString()}`;
        county = data.countyName;

        const sorted = [...data.categories].sort(
          (a, b) => b.perCapita - a.perCapita
        );
        const maxPc = sorted[0]?.perCapita || 1;
        for (const cat of sorted) {
          bars.push({
            label: `${cat.label}: $${cat.perCapita.toLocaleString()}`,
            pct: (cat.perCapita / maxPc) * 100,
            color: cat.color,
          });
        }
      }
    } catch {
      // fallback to generic
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "linear-gradient(135deg, #fafafa 0%, #e8f0fe 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#003f87",
            }}
          >
            TxTax
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#2b2d42",
              opacity: 0.5,
            }}
          >
            Where does your Texas tax money go?
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "32px",
          }}
        >
          <div style={{ fontSize: "20px", color: "#2b2d42", opacity: 0.6 }}>
            {subtitle}
          </div>
          {amount && (
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: "#003f87",
                marginTop: "8px",
                fontFamily: "monospace",
              }}
            >
              {amount}
            </div>
          )}
          <div
            style={{
              fontSize: "20px",
              color: "#2b2d42",
              opacity: 0.6,
              marginTop: "4px",
            }}
          >
            estimated per person in state taxes
          </div>
        </div>

        {/* Bars */}
        {bars.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "36px",
            }}
          >
            {bars.map((bar) => (
              <div
                key={bar.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "200px",
                    fontSize: "14px",
                    color: "#2b2d42",
                    textAlign: "right",
                  }}
                >
                  {bar.label}
                </div>
                <div
                  style={{
                    height: "24px",
                    width: `${bar.pct * 5}px`,
                    background: bar.color,
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
