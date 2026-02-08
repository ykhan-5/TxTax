import type { SpendingCategory, WeirdItem } from "@/lib/types/spending";

interface WeirdItemTemplate {
  id: string;
  emoji: string;
  template: string;
  calculate: (categoryPerCapita: number) => number;
  unit: string;
  sourceNote: string;
  category: SpendingCategory;
}

const TEMPLATES: WeirdItemTemplate[] = [
  {
    id: "teacher_days",
    emoji: "\u{1F469}\u200D\u{1F3EB}",
    template: "{value} days of a teacher's salary",
    calculate: (edu) => (edu / 57641) * 365,
    unit: "days",
    sourceNote: "Based on avg TX teacher salary of $57,641/year",
    category: "education",
  },
  {
    id: "highway_feet",
    emoji: "\u{1F6E3}\uFE0F",
    template: "{value} feet of highway paved",
    calculate: (trans) => trans / 150,
    unit: "feet",
    sourceNote: "Based on avg highway cost of ~$150/linear foot",
    category: "transportation",
  },
  {
    id: "prison_meals",
    emoji: "\u{1F37D}\uFE0F",
    template: "{value} prison meals served",
    calculate: (safety) => safety / 3.5,
    unit: "meals",
    sourceNote: "Based on avg cost of $3.50/meal in TX prisons",
    category: "public_safety",
  },
  {
    id: "ut_seconds",
    emoji: "\u{1F920}",
    template: "{value} seconds of UT Austin operations",
    calculate: (edu) => (edu / 3_100_000_000) * 365.25 * 24 * 3600,
    unit: "seconds",
    sourceNote: "Based on UT Austin annual budget of ~$3.1B",
    category: "education",
  },
  {
    id: "vaccines",
    emoji: "\u{1FA78}",
    template: "{value} vaccine doses administered",
    calculate: (health) => health / 71,
    unit: "doses",
    sourceNote: "Based on avg vaccine cost of ~$71/dose",
    category: "health",
  },
  {
    id: "potholes",
    emoji: "\u{1F573}\uFE0F",
    template: "{value} potholes fixed",
    calculate: (trans) => trans / 50,
    unit: "potholes",
    sourceNote: "Based on avg pothole repair cost of ~$50",
    category: "transportation",
  },
  {
    id: "textbooks",
    emoji: "\u{1F4DA}",
    template: "{value} student textbooks purchased",
    calculate: (edu) => edu / 80,
    unit: "textbooks",
    sourceNote: "Based on avg textbook cost of ~$80",
    category: "education",
  },
  {
    id: "trooper_vehicle",
    emoji: "\u{1F693}",
    template: "1/{value}th of a state trooper vehicle",
    calculate: (safety) => Math.round(62000 / safety),
    unit: "fraction",
    sourceNote: "Based on avg patrol vehicle cost of ~$62,000",
    category: "public_safety",
  },
  {
    id: "mental_health_mins",
    emoji: "\u{1F9E0}",
    template: "{value} minutes of mental health counseling",
    calculate: (health) => (health * 0.15) / 2.5,
    unit: "minutes",
    sourceNote: "Based on avg state-funded counseling rate of ~$150/hr",
    category: "health",
  },
  {
    id: "library_books",
    emoji: "\u{1F4D6}",
    template: "{value} library books for state archives",
    calculate: (other) => other / 25,
    unit: "books",
    sourceNote: "Based on avg library book cost of ~$25",
    category: "other",
  },
];

function formatWeirdValue(value: number): string {
  if (value >= 100) return Math.round(value).toLocaleString();
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(1);
  if (value >= 0.01) return value.toFixed(2);
  return value.toFixed(3);
}

export function generateWeirdItems(
  categoryPerCapita: Record<SpendingCategory, number>
): WeirdItem[] {
  const items: WeirdItem[] = [];

  for (const template of TEMPLATES) {
    const perCapita = categoryPerCapita[template.category];
    if (!perCapita || perCapita <= 0) continue;

    const value = template.calculate(perCapita);
    if (value <= 0 || !isFinite(value)) continue;

    const formattedValue = formatWeirdValue(value);
    const description = template.template.replace("{value}", formattedValue);

    items.push({
      id: template.id,
      emoji: template.emoji,
      description,
      calculation: template.sourceNote,
      value,
      unit: template.unit,
      dollarAmount: perCapita,
      category: template.category,
    });
  }

  // Return a diverse selection (max 6, at least one from each represented category)
  const selected: WeirdItem[] = [];
  const seenCategories = new Set<SpendingCategory>();

  // First pass: one item per category
  for (const item of items) {
    if (!seenCategories.has(item.category)) {
      selected.push(item);
      seenCategories.add(item.category);
    }
  }

  // Second pass: fill up to 6 with remaining items
  for (const item of items) {
    if (selected.length >= 6) break;
    if (!selected.includes(item)) {
      selected.push(item);
    }
  }

  return selected;
}
