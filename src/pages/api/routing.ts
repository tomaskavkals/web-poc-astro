export async function GET() {
  return new Response(
    JSON.stringify({
      article: "clanek/.*",
      match: "zapas/.*",
    })
  );
}
