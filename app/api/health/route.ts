export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    service: "absolutely-fit",
    revision: process.env.APP_REVISION || "development",
    environment: process.env.APP_ENVIRONMENT || "development",
  }, { headers: { "cache-control": "no-store" } });
}
