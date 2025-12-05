import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("CRUD Événements", () => {
  it("devrait créer un événement avec champs i18n", async () => {
    const eventData = {
      slug: "test-event-" + Date.now(),
      titleI18n: {
        fr: "Événement Test",
        ar: "حدث اختبار",
        en: "Test Event",
      },
      bodyI18n: {
        fr: "Description en français",
        ar: "الوصف بالعربية",
        en: "Description in English",
      },
      startAt: new Date("2025-12-10T10:00:00Z"),
      endAt: new Date("2025-12-10T12:00:00Z"),
      location: "Dakar, Sénégal",
      status: "DRAFT" as const,
      authorId: 1,
    };

    const event = await db.createEvent(eventData);
    
    expect(event).toBeDefined();
    expect(event?.slug).toBe(eventData.slug);
    expect(event?.titleI18n).toEqual(eventData.titleI18n);
    expect(event?.location).toBe(eventData.location);
    expect(event?.status).toBe("DRAFT");
  });

  it("devrait récupérer tous les événements", async () => {
    const events = await db.getAllEvents();
    
    expect(Array.isArray(events)).toBe(true);
    if (events.length > 0) {
      expect(events[0]).toHaveProperty("id");
      expect(events[0]).toHaveProperty("titleI18n");
      expect(events[0]).toHaveProperty("startAt");
      expect(events[0]).toHaveProperty("endAt");
    }
  });

  it("devrait récupérer un événement par ID", async () => {
    const events = await db.getAllEvents();
    if (events.length > 0) {
      const event = await db.getEventById(events[0].id);
      
      expect(event).toBeDefined();
      expect(event?.id).toBe(events[0].id);
      expect(event?.titleI18n).toBeDefined();
    }
  });

  it("devrait mettre à jour un événement", async () => {
    const events = await db.getAllEvents();
    if (events.length > 0) {
      const updatedEvent = await db.updateEvent(events[0].id, {
        status: "PUBLISHED",
      });
      
      expect(updatedEvent?.status).toBe("PUBLISHED");
    }
  });

  it("devrait supprimer (soft delete) un événement", async () => {
    const eventData = {
      slug: "event-to-delete-" + Date.now(),
      titleI18n: {
        fr: "À supprimer",
        ar: "للحذف",
        en: "To delete",
      },
      bodyI18n: {
        fr: "Test",
        ar: "اختبار",
        en: "Test",
      },
      startAt: new Date(),
      endAt: new Date(),
      status: "DRAFT" as const,
      authorId: 1,
    };

    const event = await db.createEvent(eventData);
    if (event) {
      await db.deleteEvent(event.id);
      const deletedEvent = await db.getEventById(event.id);
      
      expect(deletedEvent).toBeUndefined();
    }
  });
});

describe("CRUD Pages Statiques", () => {
  it("devrait créer une page avec champs i18n", async () => {
    const pageData = {
      slug: "test-page-" + Date.now(),
      titleI18n: {
        fr: "Page Test",
        ar: "صفحة اختبار",
        en: "Test Page",
      },
      bodyI18n: {
        fr: "Contenu en français",
        ar: "المحتوى بالعربية",
        en: "Content in English",
      },
      status: "DRAFT" as const,
      authorId: 1,
    };

    const page = await db.createPage(pageData);
    
    expect(page).toBeDefined();
    expect(page?.slug).toBe(pageData.slug);
    expect(page?.titleI18n).toEqual(pageData.titleI18n);
    expect(page?.status).toBe("DRAFT");
  });

  it("devrait récupérer toutes les pages", async () => {
    const pages = await db.getAllPagesAdmin();
    
    expect(Array.isArray(pages)).toBe(true);
    if (pages.length > 0) {
      expect(pages[0]).toHaveProperty("id");
      expect(pages[0]).toHaveProperty("titleI18n");
      expect(pages[0]).toHaveProperty("bodyI18n");
    }
  });

  it("devrait récupérer une page par ID", async () => {
    const pages = await db.getAllPagesAdmin();
    if (pages.length > 0) {
      const page = await db.getPageById(pages[0].id);
      
      expect(page).toBeDefined();
      expect(page?.id).toBe(pages[0].id);
      expect(page?.titleI18n).toBeDefined();
    }
  });

  it("devrait mettre à jour une page", async () => {
    const pages = await db.getAllPagesAdmin();
    if (pages.length > 0) {
      const updatedPage = await db.updatePage(pages[0].id, {
        status: "PUBLISHED",
      });
      
      expect(updatedPage?.status).toBe("PUBLISHED");
    }
  });

  it("devrait supprimer (soft delete) une page", async () => {
    const pageData = {
      slug: "page-to-delete-" + Date.now(),
      titleI18n: {
        fr: "À supprimer",
        ar: "للحذف",
        en: "To delete",
      },
      bodyI18n: {
        fr: "Test",
        ar: "اختبار",
        en: "Test",
      },
      status: "DRAFT" as const,
      authorId: 1,
    };

    const page = await db.createPage(pageData);
    if (page) {
      await db.deletePage(page.id);
      const deletedPage = await db.getPageById(page.id);
      
      expect(deletedPage).toBeUndefined();
    }
  });
});

describe("Événements Portal (Public)", () => {
  it("devrait récupérer uniquement les événements publiés et futurs", async () => {
    const events = await db.getPublishedEvents();
    
    expect(Array.isArray(events)).toBe(true);
    events.forEach((event: any) => {
      expect(event.status).toBe("PUBLISHED");
      expect(new Date(event.endAt).getTime()).toBeGreaterThanOrEqual(Date.now());
    });
  });
});

describe("Pages Portal (Public)", () => {
  it("devrait récupérer uniquement les pages publiées", async () => {
    const pages = await db.getPublishedPages();
    
    expect(Array.isArray(pages)).toBe(true);
    pages.forEach((page: any) => {
      expect(page.status).toBe("PUBLISHED");
    });
  });
});
