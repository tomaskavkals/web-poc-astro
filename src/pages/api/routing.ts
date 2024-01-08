export async function GET() {
  return new Response(
    JSON.stringify({
      article: "zpravy/.*",
      match: "zapas/.*",
    })
  );
}
