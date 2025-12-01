export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // GET all articles
    if (url.pathname === "/api/articles") {
      const { results } = await env.articles_db
        .prepare("SELECT * FROM articles ORDER BY created_at DESC")
        .all();
      return Response.json(results);
    }

    // GET single article by slug
    if (url.pathname.startsWith("/api/article/")) {
      const slug = url.pathname.split("/").pop();

      const article = await env.articles_db
        .prepare("SELECT * FROM articles WHERE slug = ?")
        .bind(slug)
        .first();
      return Response.json(article || {});
    }

    // POST - Add new article (Admin)
    if (url.pathname === "/api/add-article" && request.method === "POST") {
      const data = await request.json();

      await env.articles_db
        .prepare("INSERT INTO articles (title, slug, category, content, image_url) VALUES (?, ?, ?, ?, ?)")
        .bind(data.title, data.slug, data.category, data.content, data.image_url)
        .run();

      return new Response("Article added successfully", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  }
};
