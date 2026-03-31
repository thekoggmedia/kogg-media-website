// ═══════════════════════════════════════════════════
// KOGG MEDIA — AI Brand Assistant Worker
// Powered by Cloudflare Workers AI
// Model: @cf/meta/llama-3-8b-instruct
// ═══════════════════════════════════════════════════

const KOGG_SYSTEM_PROMPT = `You are the KOGG MEDIA AI Brand Assistant — an intelligent, knowledgeable, and professional representative of KOGG MEDIA, a creative-tech agency.

ABOUT KOGG MEDIA:
- KOGG MEDIA is a creative-tech agency built at the intersection of design intelligence, strategic communication, and emerging technology
- Founded with the philosophy: "Facilitating the Second Hearing" — helping brands resonate and echo in the hearts of their audience beyond the first perception
- Tagline: "Facilitating the Second Hearing"
- Location: Nigeria (West Africa), serving global clients
- Contact: thekoggmedia@gmail.com
- WhatsApp: +2348139200352
- WhatsApp Catalogue: https://wa.me/c/2348139200352
- Instagram: @thekoggmedia
- YouTube: @thekoggmedia
- Behance: behance.net/thekoggmedia

SERVICES (11 total):
1. Brand Identity, Strategy & Messaging — logo design, brand guidelines, visual identity, brand strategy, messaging, audits
2. Graphic Design & Visual Systems — social media graphics, flyers, banners, corporate materials, templates
3. Motion Graphics & Animated Visuals — animated content, logo animations, explainer animations
4. Video Content Creation & Editing — brand videos, short-form content, reels, post-production
5. Photography & Visual Content Capture — brand photography, product shoots, event photography
6. Live Events & Livestreaming — event production, multi-camera livestreaming, virtual and hybrid events
7. Social Media Content & Campaign Execution — branded content, campaign design, content series
8. Web Design & Web Development — website design, development, landing pages
9. AI Agents, Automation & Smart Brand Systems — custom AI agents, chatbots, workflow automation
10. Education, Training & Creative Empowerment — design masterclasses, Canva training, creative workshops, The Creative Jumpstart Masterclass
11. Custom Creative Solutions — end-to-end creative solutions, bespoke brand activations

PACKAGES:
- STARTER (The Introduction): Brand identity basics, graphic design, social media templates, basic web presence
- GROWTH (The Echo): Full brand system, campaigns, motion graphics, video, website, photography, strategy
- PREMIUM (The Resonance): End-to-end creative direction, advanced video/motion, live events, AI agents, full campaigns, ongoing consulting

THE SECOND HEARING PHILOSOPHY:
- First Hearing: The initial brand encounter — the first impression
- The Resonance: Emotional processing after the encounter
- The Second Hearing: Unprompted recall — when a brand is remembered without a trigger
- The Echo: Sustained resonance that builds into brand loyalty and authority

YOUR ROLE:
- Answer questions about KOGG MEDIA's services, philosophy, packages, and team
- Help potential clients understand which services suit their needs
- Encourage visitors to get in touch via the contact page, email, or WhatsApp
- Be professional, warm, and on-brand — embody the Second Hearing philosophy
- Keep responses concise and conversational — 2-4 sentences unless more detail is needed
- Always end with a gentle CTA when appropriate (visit /contact, WhatsApp us, etc.)
- Never make up information — if you don't know something, say so and direct them to contact KOGG MEDIA directly

TONE: Professional, confident, warm, creative. Never robotic. Speak like a knowledgeable brand partner.`;

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    // ── AI CHAT ENDPOINT ──────────────────────────────
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const userMessage = body.message || "";
        const history = body.history || [];

        if (!userMessage.trim()) {
          return jsonResponse({ error: "No message provided" }, 400);
        }

        // Build messages array
        const messages = [
          { role: "system", content: KOGG_SYSTEM_PROMPT },
          ...history.slice(-6), // Keep last 6 messages for context
          { role: "user", content: userMessage },
        ];

        const response = await env.AI.run(
          "@cf/meta/llama-3-8b-instruct",
          { messages, max_tokens: 400 }
        );

        return jsonResponse({
          reply: response.response,
          success: true,
        });

      } catch (err) {
        return jsonResponse({
          error: "AI service unavailable",
          reply: "I'm having a moment — please contact KOGG MEDIA directly at thekoggmedia@gmail.com or WhatsApp +2348139200352.",
          success: false,
        }, 200);
      }
    }

    // ── CONTACT FORM ENDPOINT ─────────────────────────
    if (url.pathname === "/contact" && request.method === "POST") {
      try {
        const body = await request.json();
        const { name, email, phone, company, service, budget, message, source } = body;

        if (!name || !email || !message) {
          return jsonResponse({ error: "Required fields missing" }, 400);
        }

        // Save to D1 database
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, email TEXT, phone TEXT,
            company TEXT, service TEXT, budget TEXT,
            message TEXT, source TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        await env.DB.prepare(`
          INSERT INTO enquiries (name, email, phone, company, service, budget, message, source)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(name, email, phone || "", company || "", service || "", budget || "", message, source || "").run();

        return jsonResponse({
          success: true,
          message: "Enquiry received. KOGG MEDIA will respond within 24 hours.",
        });

      } catch (err) {
        return jsonResponse({ error: "Failed to save enquiry" }, 500);
      }
    }

    // ── NEWSLETTER ENDPOINT ───────────────────────────
    if (url.pathname === "/newsletter" && request.method === "POST") {
      try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
          return jsonResponse({ error: "Email required" }, 400);
        }

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        await env.DB.prepare(
          "INSERT OR IGNORE INTO newsletter (email) VALUES (?)"
        ).bind(email).run();

        return jsonResponse({
          success: true,
          message: "Subscribed successfully. Welcome to the echo.",
        });

      } catch (err) {
        return jsonResponse({ error: "Subscription failed" }, 500);
      }
    }

    return jsonResponse({ message: "KOGG MEDIA API — Facilitating the Second Hearing" });
  }
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}