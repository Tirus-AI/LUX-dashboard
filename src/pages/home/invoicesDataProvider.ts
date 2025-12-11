import type {
  DataProvider,
  GetListParams,
  GetListResult,
  RaRecord,
} from "react-admin";

type InvoiceRow = RaRecord & {
  invoice_no: string;
  customer: string;
  supplier: string;
  product: string;
  status: "pending" | "approved" | "rejected";
  amount: number;
  date: string;
};

const MOCK: InvoiceRow[] = [
  {
    id: "INV-1001",
    invoice_no: "INV-1001",
    customer: "Emma Johnson",
    supplier: "PartsCo USA",
    product: "Wheel Kit",
    status: "pending",
    amount: 1299,
    date: "2025-08-20",
  },
  {
    id: "INV-1002",
    invoice_no: "INV-1002",
    customer: "Liam Thompson",
    supplier: "CarPartsDirect",
    product: "Oil Filter",
    status: "approved",
    amount: 89,
    date: "2025-08-21",
  },
  {
    id: "INV-1003",
    invoice_no: "INV-1003",
    customer: "Noah Williams",
    supplier: "AutoWorld Supply",
    product: "Hydraulic Hose",
    status: "rejected",
    amount: 215,
    date: "2025-08-22",
  },
  {
    id: "INV-1004",
    invoice_no: "INV-1004",
    customer: "Ava Martinez",
    supplier: "Global Auto Parts",
    product: "Brake Pads",
    status: "approved",
    amount: 640,
    date: "2025-08-23",
  },
  {
    id: "INV-1005",
    invoice_no: "INV-1005",
    customer: "Olivia Davis",
    supplier: "Speedy Supplies",
    product: "Air Filter",
    status: "pending",
    amount: 120,
    date: "2025-08-24",
  },
  {
    id: "INV-1006",
    invoice_no: "INV-1006",
    customer: "Mason Clark",
    supplier: "PrimeAuto Wholesale",
    product: "Battery",
    status: "approved",
    amount: 210,
    date: "2025-08-25",
  },
  {
    id: "INV-1007",
    invoice_no: "INV-1007",
    customer: "Sophia Garcia",
    supplier: "Universal Car Supply",
    product: "Spark Plug",
    status: "pending",
    amount: 45,
    date: "2025-08-26",
  },
  {
    id: "INV-1008",
    invoice_no: "INV-1008",
    customer: "Emma Johnson",
    supplier: "PartsCo USA",
    product: "Wheel Kit",
    status: "pending",
    amount: 1299,
    date: "2025-08-20",
  },
  {
    id: "INV-1009",
    invoice_no: "INV-1009",
    customer: "Liam Thompson",
    supplier: "CarPartsDirect",
    product: "Oil Filter",
    status: "approved",
    amount: 89,
    date: "2025-08-21",
  },
  {
    id: "INV-1010",
    invoice_no: "INV-1010",
    customer: "Noah Williams",
    supplier: "AutoWorld Supply",
    product: "Hydraulic Hose",
    status: "rejected",
    amount: 215,
    date: "2025-08-22",
  },
  {
    id: "INV-1011",
    invoice_no: "INV-1011",
    customer: "Ava Martinez",
    supplier: "Global Auto Parts",
    product: "Brake Pads",
    status: "approved",
    amount: 640,
    date: "2025-08-23",
  },
  {
    id: "INV-1012",
    invoice_no: "INV-1012",
    customer: "Olivia Davis",
    supplier: "Speedy Supplies",
    product: "Air Filter",
    status: "pending",
    amount: 120,
    date: "2025-08-24",
  },
  {
    id: "INV-1013",
    invoice_no: "INV-1013",
    customer: "Mason Clark",
    supplier: "PrimeAuto Wholesale",
    product: "Battery",
    status: "approved",
    amount: 210,
    date: "2025-08-25",
  },
  {
    id: "INV-1014",
    invoice_no: "INV-1014",
    customer: "Sophia Garcia",
    supplier: "Universal Car Supply",
    product: "Spark Plug",
    status: "pending",
    amount: 45,
    date: "2025-08-26",
  },

  // +20 more
  {
    id: "INV-1015",
    invoice_no: "INV-1015",
    customer: "Ethan Brown",
    supplier: "MetroParts",
    product: "Alternator",
    status: "approved",
    amount: 380,
    date: "2025-08-01",
  },
  {
    id: "INV-1016",
    invoice_no: "INV-1016",
    customer: "Isabella Wilson",
    supplier: "Titan Auto",
    product: "Radiator",
    status: "pending",
    amount: 460,
    date: "2025-08-03",
  },
  {
    id: "INV-1017",
    invoice_no: "INV-1017",
    customer: "Mia Anderson",
    supplier: "Apex Components",
    product: "Headlight Assembly",
    status: "rejected",
    amount: 189,
    date: "2025-08-04",
  },
  {
    id: "INV-1018",
    invoice_no: "INV-1018",
    customer: "James Lee",
    supplier: "NovaGear",
    product: "Brake Rotor",
    status: "approved",
    amount: 265,
    date: "2025-08-05",
  },
  {
    id: "INV-1019",
    invoice_no: "INV-1019",
    customer: "Charlotte Taylor",
    supplier: "BlueLine Parts",
    product: "Fuel Pump",
    status: "pending",
    amount: 330,
    date: "2025-08-06",
  },
  {
    id: "INV-1020",
    invoice_no: "INV-1020",
    customer: "Benjamin Moore",
    supplier: "RapidAuto",
    product: "Timing Belt",
    status: "approved",
    amount: 140,
    date: "2025-08-07",
  },
  {
    id: "INV-1021",
    invoice_no: "INV-1021",
    customer: "Amelia Harris",
    supplier: "Horizon Spares",
    product: "Ignition Coil",
    status: "pending",
    amount: 95,
    date: "2025-08-08",
  },
  {
    id: "INV-1022",
    invoice_no: "INV-1022",
    customer: "Lucas White",
    supplier: "Westside Auto",
    product: "Muffler",
    status: "approved",
    amount: 220,
    date: "2025-08-09",
  },
  {
    id: "INV-1023",
    invoice_no: "INV-1023",
    customer: "Harper Martin",
    supplier: "Quantum Parts",
    product: "Shock Absorber",
    status: "rejected",
    amount: 175,
    date: "2025-08-10",
  },
  {
    id: "INV-1024",
    invoice_no: "INV-1024",
    customer: "Elijah Thompson",
    supplier: "Eagle Auto Supply",
    product: "Wiper Motor",
    status: "approved",
    amount: 88,
    date: "2025-08-11",
  },
  {
    id: "INV-1025",
    invoice_no: "INV-1025",
    customer: "Evelyn Walker",
    supplier: "Velocity Components",
    product: "AC Compressor",
    status: "pending",
    amount: 560,
    date: "2025-08-13",
  },
  {
    id: "INV-1026",
    invoice_no: "INV-1026",
    customer: "Alexander Young",
    supplier: "Summit Parts",
    product: "Starter Motor",
    status: "approved",
    amount: 310,
    date: "2025-08-14",
  },
  {
    id: "INV-1027",
    invoice_no: "INV-1027",
    customer: "Abigail Scott",
    supplier: "Orion Auto",
    product: "Control Arm",
    status: "pending",
    amount: 205,
    date: "2025-08-15",
  },
  {
    id: "INV-1028",
    invoice_no: "INV-1028",
    customer: "Michael King",
    supplier: "Pioneer Spares",
    product: "Tie Rod",
    status: "approved",
    amount: 120,
    date: "2025-08-16",
  },
  {
    id: "INV-1029",
    invoice_no: "INV-1029",
    customer: "Emily Green",
    supplier: "Prime Components",
    product: "Battery Cable",
    status: "rejected",
    amount: 48,
    date: "2025-08-17",
  },
  {
    id: "INV-1030",
    invoice_no: "INV-1030",
    customer: "Daniel Baker",
    supplier: "Union Auto Parts",
    product: "Cabin Filter",
    status: "approved",
    amount: 35,
    date: "2025-08-18",
  },
  {
    id: "INV-1031",
    invoice_no: "INV-1031",
    customer: "Avery Adams",
    supplier: "Zenith Supply",
    product: "Serpentine Belt",
    status: "pending",
    amount: 55,
    date: "2025-08-19",
  },
  {
    id: "INV-1032",
    invoice_no: "INV-1032",
    customer: "Henry Nelson",
    supplier: "Atlas Auto",
    product: "Throttle Body",
    status: "approved",
    amount: 420,
    date: "2025-08-27",
  },
  {
    id: "INV-1033",
    invoice_no: "INV-1033",
    customer: "Grace Carter",
    supplier: "Cascade Components",
    product: "Oxygen Sensor",
    status: "pending",
    amount: 75,
    date: "2025-08-29",
  },
  {
    id: "INV-1034",
    invoice_no: "INV-1034",
    customer: "Jack Rivera",
    supplier: "Vertex Auto",
    product: "Water Pump",
    status: "approved",
    amount: 265,
    date: "2025-09-05",
  },
];

function getByPath(obj: any, path?: string) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

function sortArray<T extends RaRecord>(rows: T[], field?: string, order?: "ASC" | "DESC") {
  if (!field) return rows;
  const dir = order === "DESC" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const va = getByPath(a, field);
    const vb = getByPath(b, field);
    if (va == null && vb == null) return 0;
    if (va == null) return -1 * dir;
    if (vb == null) return 1 * dir;
    const na = typeof va === "string" ? Number(va) : va;
    const nb = typeof vb === "string" ? Number(vb) : vb;
    if (typeof na === "number" && typeof nb === "number" && !Number.isNaN(na) && !Number.isNaN(nb)) {
      return (na - nb) * dir;
    }
    return String(va).localeCompare(String(vb)) * dir;
  });
}

function filterArray<T extends RaRecord>(rows: T[], filter: any) {
  if (!filter || Object.keys(filter).length === 0) return rows;

  const q = (filter.q ?? "").toString().trim().toLowerCase();
  const status = (filter.status ?? "").toString().trim().toLowerCase();

  return rows.filter((r: any) => {
    const haystack = [
      r.invoice_no,
      r.customer,
      r.supplier,
      r.product,
      r.status,
      r.amount,
      r.date,
    ]
      .map((v) => String(v ?? "").toLowerCase())
      .join(" | ");

    const textOk = !q || haystack.includes(q);
    const statusOk = !status || String(r.status).toLowerCase() === status;
    return textOk && statusOk;
  });
}

const invoicesDataProvider: DataProvider = {
  async getList(resource: string, params: GetListParams): Promise<GetListResult> {
    if (resource !== "invoices") return { data: [], total: 0 };

    const { page = 1, perPage = 25 } = params.pagination ?? {};
    const { field, order } = params.sort ?? {};

    let rows = [...MOCK];
    rows = filterArray(rows as any, params.filter ?? {});
    rows = sortArray(rows, field, order);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { data: rows.slice(start, end), total: rows.length };
  },

  // stubs (not used here)
  getOne: async () => ({ data: {} as any }),
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async () => ({ data: {} as any }),
  update: async () => ({ data: {} as any }),
  updateMany: async () => ({ data: [] }),
  delete: async () => ({ data: {} as any }),
  deleteMany: async () => ({ data: [] }),
};

export default invoicesDataProvider;