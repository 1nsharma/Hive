// WhatsApp Deep-Link Builder with Explicit Privacy Opt-in

export function buildWhatsAppLink(ownerPhone: string, petName: string, areaOrLocation?: string): string {
  const digits = ownerPhone.replace(/\D/g, "");
  const locationSuffix = areaOrLocation ? ` Location/Area: ${areaOrLocation}.` : "";
  const text = encodeURIComponent(
    `Hi! Maine ${petName} ko dekha hai.${locationSuffix} Main apni current location share kar raha/rahi hu.`
  );
  return `https://wa.me/${digits}?text=${text}`;
}
