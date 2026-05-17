export interface Stats {
  total_spending: number;
  total_income: number;
  largest_transaction: number;
}

interface Props {
  documentCount: number;
  stats: Stats | null;
}

interface Card {
  label: string;
  value: string;
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Dashboard({ documentCount, stats }: Props) {
  const cards: Card[] = [
    {
      label: 'Total Spending',
      value: stats ? formatCurrency(stats.total_spending) : '—',
    },
    {
      label: 'Total Income',
      value: stats ? formatCurrency(stats.total_income) : '—',
    },
    {
      label: 'Largest Transaction',
      value: stats ? formatCurrency(stats.largest_transaction) : '—',
    },
    {
      label: 'Documents Uploaded',
      value: `${documentCount} document${documentCount !== 1 ? 's' : ''}`,
    },
  ];

  return (
    <section>
      <h2
        className="text-lg font-semibold mb-3"
        style={{ color: 'var(--theme-text)' }}
      >
        Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 flex flex-col gap-1"
            style={{
              background: 'var(--theme-background-input)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <span
              className="text-sm"
              style={{ color: 'var(--theme-text)', opacity: 0.55 }}
            >
              {card.label}
            </span>
            <span
              className="text-2xl font-bold"
              style={{ color: 'var(--theme-text)' }}
            >
              {card.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
