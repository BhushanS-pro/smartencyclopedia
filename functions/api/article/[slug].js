export async function onRequestGet({ env, params }) {
  const article = await env.articles_db
    .prepare("SELECT * FROM articles WHERE slug = ?")
    .bind(params.slug)
    .first();

  return Response.json(article || {});
}
