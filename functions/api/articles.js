export async function onRequestGet({ env }) {
  const { results } = await env.articles_db
    .prepare("SELECT * FROM articles ORDER BY created_at DESC")
    .all();

  return Response.json(results);
}
