// Every WhatsApp link in the app should go through here so the pre-filled
// message stays consistent instead of some links opening blank and others
// carrying ad-hoc text.
export function generalInquiryWhatsAppLink(whatsappNumber: string): string {
  const text = "Hi TheAamGhar! I have a question about your mangoes.";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// Used when an admin rejects a payment proof -- the order number is what
// support needs first, so it's pre-filled rather than making the customer
// dig it out of their email.
export function paymentIssueWhatsAppLink(whatsappNumber: string, orderNumber: string): string {
  const text = `Hi TheAamGhar! I need help with the payment for my order ${orderNumber}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function productOrderWhatsAppLink(
  whatsappNumber: string,
  productName: string,
  boxSizeKg?: number
): string {
  const sizeNote = boxSizeKg ? ` (${boxSizeKg}kg box)` : "";
  const text = `Hi TheAamGhar! I'd like to order ${productName}${sizeNote}. Is it available?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
