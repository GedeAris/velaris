export function getWhatsAppHref(message?: string) {
  const explicitLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK;
  if (explicitLink) return explicitLink;

  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285198466493";
  const number = rawNumber.replace(/[^\d]/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";

  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
