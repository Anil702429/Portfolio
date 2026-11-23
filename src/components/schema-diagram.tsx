import type { CSSProperties } from "react";

/**
 * NepCart's real data model (accounts, cart, orders, payments, products).
 * The dashed boundary is the transaction.atomic() block in orders/views.py.
 */
type Table = { name: string; x: number; y: number; fields: [string, string][] };
type Layout = {
  width: number;
  height: number;
  tableWidth: number;
  tables: Table[];
  edges: string[];
  /** Edges, in reading direction, that carry a slow ambient signal. */
  packets: string[];
  boundary: { x: number; y: number; width: number; height: number };
};

const HEAD = 34;
const ROW = 24;
const heightOf = (table: Table) => HEAD + table.fields.length * ROW + 10;

const order: Table["fields"] = [
  ["user", "FK"],
  ["order_number", "UQ"],
  ["total", ""],
  ["payment_status", ""],
  ["status", ""],
];
const orderItem: Table["fields"] = [
  ["order", "FK"],
  ["product", "FK"],
  ["product_price", ""],
  ["quantity", ""],
];
const payment: Table["fields"] = [
  ["order", "1:1"],
  ["transaction_id", ""],
  ["amount", ""],
  ["status", ""],
];
const product: Table["fields"] = [
  ["category", "FK"],
  ["sku", "UQ"],
  ["price", ""],
  ["stock", ""],
];

const wide: Layout = {
  width: 730,
  height: 590,
  tableWidth: 190,
  tables: [
    { name: "User", x: 1, y: 22, fields: [["username", "UQ"]] },
    { name: "Order", x: 270, y: 22, fields: order },
    { name: "Payment", x: 539, y: 22, fields: payment },
    { name: "CartItem", x: 1, y: 250, fields: [["user", "FK"], ["product", "FK"], ["quantity", ""]] },
    { name: "OrderItem", x: 270, y: 296, fields: orderItem },
    { name: "Product", x: 539, y: 270, fields: product },
    { name: "Category", x: 539, y: 494, fields: [["name", ""], ["slug", "UQ"]] },
  ],
  edges: [
    "M191 72H270",
    "M96 90V250",
    "M460 72H539",
    "M365 186V296",
    "M460 358H539",
    "M96 366V520H505V386H539",
    "M634 410V494",
  ],
  packets: ["M191 72H270", "M365 186V296", "M460 358H539"],
  boundary: { x: 250, y: 2, width: 230, height: 468 },
};

const compact: Layout = {
  width: 350,
  height: 400,
  tableWidth: 154,
  tables: [
    { name: "Order", x: 11, y: 14, fields: order },
    { name: "Payment", x: 195, y: 14, fields: payment },
    { name: "OrderItem", x: 11, y: 224, fields: orderItem },
    { name: "Product", x: 195, y: 224, fields: product },
  ],
  edges: ["M165 60H195", "M88 178V224", "M165 296H195"],
  packets: ["M88 178V224", "M165 296H195"],
  boundary: { x: 1, y: 2, width: 174, height: 376 },
};

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

function Diagram({ layout, className }: { layout: Layout; className: string }) {
  const { boundary, tableWidth } = layout;
  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={`h-auto w-full font-mono ${className}`}
      aria-hidden="true"
      fontSize="12.5"
    >
      {layout.edges.map((d, index) => (
        <g key={d}>
          <path d={d} pathLength={1} className="schema-edge fill-none stroke-[#6c6f76]" strokeWidth="1.25" style={stagger(index)} />
        </g>
      ))}
      {layout.packets.map((d, index) => (
        <path
          key={`packet-${d}`}
          d={d}
          pathLength={1}
          className="packet fill-none stroke-ink-accent"
          strokeWidth="2"
          strokeLinecap="round"
          style={stagger(index)}
        />
      ))}
      <rect
        {...boundary}
        rx="3"
        className="schema-boundary fill-[#2146f5]/10 stroke-ink-accent"
        strokeWidth="1.25"
        strokeDasharray="5 5"
      />
      {layout.tables.map((table, index) => (
        <g key={table.name} className="schema-table" style={stagger(index)}>
          <rect x={table.x} y={table.y} width={tableWidth} height={heightOf(table)} rx="3" className="fill-[#191a1d] stroke-[#4a4d54]" />
          <path d={`M${table.x} ${table.y + HEAD}h${tableWidth}`} className="stroke-[#4a4d54]" />
          <text x={table.x + 13} y={table.y + 22} className="fill-white" fontWeight="600" fontSize="13.5">
            {table.name}
          </text>
          {table.fields.map(([field, kind], row) => (
            <g key={field}>
              <text x={table.x + 13} y={table.y + HEAD + 21 + row * ROW} className="fill-[#c6c7ca]">
                {field}
              </text>
              <text x={table.x + tableWidth - 12} y={table.y + HEAD + 21 + row * ROW} textAnchor="end" className="fill-ink-accent">
                {kind}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

export function SchemaDiagram() {
  return (
    <figure className="min-w-0">
      <Diagram layout={wide} className="hidden sm:block lg:hidden xl:block" />
      <Diagram layout={compact} className="sm:hidden lg:block xl:hidden" />
      <figcaption className="mt-5 flex items-start gap-3 text-sm text-ink-soft">
        <svg viewBox="0 0 28 10" className="mt-1.5 w-7 shrink-0" aria-hidden="true">
          <path d="M0 5h28" className="stroke-ink-accent" strokeDasharray="5 4" strokeWidth="1.5" />
        </svg>
        <span>
          Part of the data model behind NepCart. An order and its items are saved in one{" "}
          <code className="font-mono text-ink-text">transaction.atomic()</code>, so neither exists without the other.
        </span>
      </figcaption>
    </figure>
  );
}
