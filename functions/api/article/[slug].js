export async function onRequestGet({ env, params }) {
  const article = await env.articles_db
    .prepare("SELECT * FROM articles WHERE slug = ?")
    .bind(params.slug)
    .first();

  return Response.json(article || {});
}

export async function onRequestPut({ request, env, params }) {
  const data = await request.json();

  // We keep slug locked – only title, category, content, image_url can change
  const { title, category, content, image_url } = data;

  if (!title || !content) {
    return new Response("Title and content are required", { status: 400 });
  }

  await env.articles_db
    .prepare(
      "UPDATE articles SET title = ?, category = ?, content = ?, image_url = ? WHERE slug = ?"
    )
    .bind(title, category, content, image_url || "", params.slug)
    .run();

  return new Response("Article updated successfully", { status: 200 });
}

export async function onRequestDelete({ env, params }) {
  await env.articles_db
    .prepare("DELETE FROM articles WHERE slug = ?")
    .bind(params.slug)
    .run();

  return new Response("Article deleted successfully", { status: 200 });
}
