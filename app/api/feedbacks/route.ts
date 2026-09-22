import { fetchReviews } from "@/lib/sellauth-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const productId = new URL(request.url).searchParams.get("productId") || undefined;
    const reviews = await fetchReviews(productId);
    return Response.json({ reviews });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reviews could not be loaded.";
    return Response.json({ error: message }, { status: 502 });
  }
}
