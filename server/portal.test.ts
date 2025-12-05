import { describe, it, expect, beforeAll } from 'vitest';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers';
import superjson from 'superjson';

// Créer un client tRPC pour les tests
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      transformer: superjson,
    }),
  ],
});

describe('Portal API Tests', () => {
  describe('Articles', () => {
    it('devrait récupérer la liste des articles publiés', async () => {
      const articles = await trpc.portal.articles.query();
      
      expect(articles).toBeDefined();
      expect(Array.isArray(articles)).toBe(true);
      
      // Vérifier que tous les articles sont publiés
      articles.forEach(article => {
        expect(article.status).toBe('PUBLISHED');
        expect(article.deletedAt).toBeNull();
      });
    });

    it('devrait récupérer un article par slug', async () => {
      // D'abord récupérer la liste pour obtenir un slug valide
      const articles = await trpc.portal.articles.query();
      
      if (articles.length > 0) {
        const firstArticle = articles[0];
        const article = await trpc.portal.articleBySlug.query({ slug: firstArticle.slug });
        
        expect(article).toBeDefined();
        expect(article.slug).toBe(firstArticle.slug);
        expect(article.status).toBe('PUBLISHED');
        
        // Vérifier les champs i18n
        if (article.titleI18n) {
          expect(article.titleI18n).toHaveProperty('fr');
          expect(article.titleI18n).toHaveProperty('ar');
          expect(article.titleI18n).toHaveProperty('en');
        }
      }
    });

    it('devrait échouer pour un slug inexistant', async () => {
      await expect(
        trpc.portal.articleBySlug.query({ slug: 'article-inexistant-xyz' })
      ).rejects.toThrow();
    });
  });

  describe('Événements', () => {
    it('devrait récupérer la liste des événements futurs publiés', async () => {
      const events = await trpc.portal.events.query();
      
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
      
      // Vérifier que tous les événements sont publiés et futurs
      const now = new Date();
      events.forEach(event => {
        expect(event.status).toBe('PUBLISHED');
        expect(event.deletedAt).toBeNull();
        expect(new Date(event.endAt).getTime()).toBeGreaterThanOrEqual(now.getTime());
      });
    });

    it('devrait vérifier la structure i18n des événements', async () => {
      const events = await trpc.portal.events.query();
      
      if (events.length > 0) {
        const firstEvent = events[0];
        
        // Vérifier les champs i18n
        expect(firstEvent.titleI18n).toBeDefined();
        expect(firstEvent.titleI18n).toHaveProperty('fr');
        expect(firstEvent.titleI18n).toHaveProperty('ar');
        expect(firstEvent.titleI18n).toHaveProperty('en');
        
        expect(firstEvent.bodyI18n).toBeDefined();
        expect(firstEvent.bodyI18n).toHaveProperty('fr');
        expect(firstEvent.bodyI18n).toHaveProperty('ar');
        expect(firstEvent.bodyI18n).toHaveProperty('en');
        
        // Vérifier les dates
        expect(firstEvent.startAt).toBeDefined();
        expect(firstEvent.endAt).toBeDefined();
        expect(new Date(firstEvent.endAt).getTime()).toBeGreaterThan(new Date(firstEvent.startAt).getTime());
      }
    });
  });

  describe('Pages statiques', () => {
    it('devrait récupérer la liste des pages publiées', async () => {
      const pages = await trpc.portal.pages.query();
      
      expect(pages).toBeDefined();
      expect(Array.isArray(pages)).toBe(true);
      
      // Vérifier que toutes les pages sont publiées
      pages.forEach(page => {
        expect(page.status).toBe('PUBLISHED');
        expect(page.deletedAt).toBeNull();
      });
    });
  });

  describe('Contact', () => {
    it('devrait envoyer un message de contact valide', async () => {
      const result = await trpc.portal.contact.mutate({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Ceci est un message de test pour valider l\'API de contact.',
      });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un message avec email invalide', async () => {
      await expect(
        trpc.portal.contact.mutate({
          name: 'Test User',
          email: 'email-invalide',
          subject: 'Test',
          message: 'Message de test',
        })
      ).rejects.toThrow();
    });

    it('devrait rejeter un message trop court', async () => {
      await expect(
        trpc.portal.contact.mutate({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test',
          message: 'Court', // Moins de 10 caractères
        })
      ).rejects.toThrow();
    });
  });

  describe('Recherche', () => {
    it('devrait effectuer une recherche unifiée', async () => {
      const results = await trpc.portal.search.query({
        query: 'test',
        lang: 'fr',
      });
      
      expect(results).toBeDefined();
      expect(results).toHaveProperty('posts');
      expect(results).toHaveProperty('events');
      expect(results).toHaveProperty('pages');
      
      expect(Array.isArray(results.posts)).toBe(true);
      expect(Array.isArray(results.events)).toBe(true);
      expect(Array.isArray(results.pages)).toBe(true);
    });

    it('devrait rejeter une recherche trop courte', async () => {
      await expect(
        trpc.portal.search.query({
          query: 'a', // Moins de 2 caractères
          lang: 'fr',
        })
      ).rejects.toThrow();
    });

    it('devrait supporter les différentes langues', async () => {
      const langues = ['fr', 'ar', 'en'] as const;
      
      for (const lang of langues) {
        const results = await trpc.portal.search.query({
          query: 'test',
          lang,
        });
        
        expect(results).toBeDefined();
      }
    });
  });
});
