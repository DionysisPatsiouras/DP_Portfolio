const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 40_000) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const fields = payload as Record<string, unknown>;
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";

  if (
    !name || name.length > 120 ||
    !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message || message.length > 5000
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const missingConfig = [
    ["EMAILJS_SERVICE_ID", serviceId],
    ["EMAILJS_TEMPLATE_ID", templateId],
    ["EMAILJS_PUBLIC_KEY", publicKey],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missingConfig.length > 0) {
    console.error(`Contact form: missing ${missingConfig.join(", ")}.`);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        ...(process.env.EMAILJS_PRIVATE_KEY ? { accessToken: process.env.EMAILJS_PRIVATE_KEY } : {}),
        template_params: {
          name,
          email,
          title: "Νέο μήνυμα από το DP Portfolio",
          message,
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      let details = (await response.text()).slice(0, 500);
      for (const value of [serviceId, templateId, publicKey, process.env.EMAILJS_PRIVATE_KEY, name, email]) {
        if (value) details = details.replaceAll(value, "[redacted]");
      }
      console.error(`Contact form: EmailJS returned status ${response.status}: ${details.replace(/[\r\n\t]/g, " ")}`);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }

    return Response.json({ sent: true });
  } catch {
    console.error("Contact form: EmailJS request failed.");
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
}
