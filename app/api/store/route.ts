import { fetchStore } from "@/lib/sellauth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await fetchStore();
    return Response.json(store);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The store could not be loaded.";
    return Response.json({ error: message }, { status: 502 });
  }
}
