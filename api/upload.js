/* global process */
/**
 * Vercel Serverless Function — /api/upload
 * Proxies photo uploads to Google Apps Script so the Apps Script
 * URL is never exposed to the browser (stored as env variable).
 *
 * Set APPS_SCRIPT_URL in your Vercel project's Environment Variables.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
  if (!APPS_SCRIPT_URL) {
    return res.status(500).json({ ok: false, error: "Upload service not configured" });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json().catch(() => ({}));
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
