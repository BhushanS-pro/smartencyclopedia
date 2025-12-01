export async function onRequestPost({ request, env }) {
  const data = await request.json();

  await env.articles_db
    .prepare(`
      INSERT INTO articles (title, slug, category, content, image_url)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(data.title, data.slug, data.category, data.content, data.image_url)
    .run();

  return new Response("Article added successfully", { status: 200 });
}
