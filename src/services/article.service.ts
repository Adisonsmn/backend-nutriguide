import prisma from '../models/prisma.js';

export const articleService = {
  async getAllArticles(category?: string) {
    const whereClause: Record<string, unknown> = {};

    if (category) {
      whereClause.category = category;
    }

    return prisma.article.findMany({
      where: whereClause,
      select: {
        article_id: true,
        title: true,
        category: true,
        image_url: true,
        published_at: true,
        // Preview: first 200 chars of content
        content: true,
      },
      orderBy: { published_at: 'desc' },
    });
  },

  async getArticleById(articleId: string) {
    const article = await prisma.article.findUnique({
      where: { article_id: articleId },
    });

    if (!article) {
      throw Object.assign(new Error('Article not found'), { statusCode: 404 });
    }

    return article;
  },
};
