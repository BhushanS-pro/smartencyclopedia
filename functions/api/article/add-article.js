export async function onRequestPost({ request, env }) {
  const data = await request.json();

  // 🔒 Defensive normalization (prevents bad data forever)
  const category = String(data.category || "")
    .trim()
    .toLowerCase();

  await env.articles_db
    .prepare(`
      INSERT INTO articles (title, slug, category, content, image_url)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(
      data.title,
      data.slug,
      category,
      data.content,
      data.image_url
    )
    .run();

  return new Response("Article added successfully", { status: 200 });
}
