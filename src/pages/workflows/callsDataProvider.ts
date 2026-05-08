import type {
  DataProvider,
  GetListParams,
  GetListResult,
  RaRecord,
} from "react-admin";

import { retellClient } from "../../services/retell";

async function fetchCalls(): Promise<any[]> {
  const body = await retellClient.call.list({});

  const list = Array.isArray(body)
    ? body
    : (body as any)?.data ?? [];

  return list.map((r: any) => ({
    id: r.call_id ?? crypto.randomUUID(),
    ...r,
  }));
}

function getByPath(obj: any, path?: string) {
  if (!path) return undefined;
  return path.split('.').reduce(
    (acc, key) => (acc == null ? undefined : acc[key]),
    obj
  );
}

function sortArray<T extends RaRecord>(
  rows: T[],
  field?: string,
  order?: 'ASC' | 'DESC'
) {
  if (!field) return rows;
  const dir = order === 'DESC' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const va = getByPath(a, field);
    const vb = getByPath(b, field);

    if (va == null && vb == null) return 0;
    if (va == null) return -1 * dir;
    if (vb == null) return 1 * dir;

    const na = typeof va === 'string' ? Number(va) : va;
    const nb = typeof vb === 'string' ? Number(vb) : vb;

    if (!Number.isNaN(na as number) && !Number.isNaN(nb as number) && typeof na === 'number' && typeof nb === 'number') {
      return (na - nb) * dir;
    }

    return String(va).localeCompare(String(vb)) * dir;
  });
}

function filterArray<T extends RaRecord>(rows: T[], filter: any) {
  if (!filter || Object.keys(filter).length === 0) return rows;

  if (typeof filter === "string") {
    const q = filter.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }

  // fielded filters
  return rows.filter((r) =>
    Object.entries(filter).every(([k, val]) => {
      const recVal = getByPath(r, k);

      if (val && typeof val === "object" && !Array.isArray(val)) {
        let num = recVal as number;

        if (typeof num === "string") {
          const asNum = Number(num);
          if (!Number.isNaN(asNum)) num = asNum;
        }

        if (typeof num !== "number") return false;

        const { gte, gt, lte, lt } = val as any;
        if (gte != null && !(num >= gte)) return false;
        if (gt != null && !(num > gt)) return false;
        if (lte != null && !(num <= lte)) return false;
        if (lt != null && !(num < lt)) return false;
        return true;
      }

      return String(recVal ?? "").toLowerCase().includes(String(val).toLowerCase());
    })
  );
}

const callsDataProvider: DataProvider = {
  async getList(resource: string, params: GetListParams): Promise<GetListResult> {
    if (resource !== "calls") {
      return { data: [], total: 0 };
    }

    let all = await fetchCalls();

    all = all.map((row: any) => {
      const durationMs = Number(row.duration_ms ?? 0);
      const durationSecStr = String(Math.round(durationMs / 1000));

      return {
        ...row,
        call_id: `${row.call_id ?? ""}`,
        call_cost: row.call_cost
          ? {
            ...row.call_cost,
            combined_cost: Number(row.call_cost.combined_cost ?? 0) / 100,
          }
          : row.call_cost,
        duration_str: durationSecStr,
      };
    });

    const f = { ...(params.filter || {}) };

    const costNeedleRaw =
      (f as any).cost_contains ??
      (f as any)["call_cost.combined_cost_contains"] ??
      (f as any)["call_cost.combined_cost"];

    delete (f as any).cost_contains;
    delete (f as any)["call_cost.combined_cost_contains"];

    const costNeedle =
      typeof costNeedleRaw === "string" ? costNeedleRaw.trim() : "";
    const durationNeedleRaw =
      (f as any).duration_contains ??
      (typeof (f as any).duration_ms === "string" ? (f as any).duration_ms : undefined);

    delete (f as any).duration_contains;
    if (typeof (f as any).duration_ms === "string") {
      delete (f as any).duration_ms;
    }
    delete (f as any).duration_contains;
    if (typeof (f as any).duration_ms === "string") {
      delete (f as any).duration_ms;
    }
    let filtered = filterArray(all, f);

    if (costNeedle) {
      const n = costNeedle.replace(/[^\d.]/g, "").toLowerCase();
      if (n) {
        filtered = filtered.filter((row: any) => {
          const dollars = getByPath(row, "call_cost.combined_cost");
          if (dollars == null) return false;
          const str = Number(dollars).toFixed(2);
          return str.toLowerCase().includes(n);
        });
      }
    }

    if (durationNeedleRaw) {
      const n = durationNeedleRaw.trim().toLowerCase();
      if (n) {
        filtered = filtered.filter((row: any) => {
          return (row.duration_str ?? "").toLowerCase().includes(n);
        });
      }
    }

    const { field, order } = params.sort ?? {};
    const sorted = sortArray(filtered, field, order);

    const { page = 1, perPage = 25 } = params.pagination ?? {};
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paged = sorted.slice(start, end);

    return { data: paged, total: filtered.length };
  },

delete: async (_resource, params) => {
  console.log("Delete:", params.id);

  // if Retell supports delete:
  // await retellClient.call.delete(String(params.id));

  return { data: { id: params.id } as any };
},

deleteMany: async (_resource, params) => {
  console.log("Delete many:", params.ids);

  // if supported:
  // await Promise.all(
  //   params.ids.map(id =>
  //     retellClient.call.delete(String(id))
  //   )
  // );

  return { data: params.ids };
},

  getOne: async () => ({ data: {} as any }),
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async () => ({ data: {} as any }),
  update: async () => ({ data: {} as any }),
  updateMany: async () => ({ data: [] }),
};

export default callsDataProvider;