// Every WhatsApp link in the app should go through here so the pre-filled
// message stays consistent instead of some links opening blank and others
// carrying ad-hoc text.
export function generalInquiryWhatsAppLink(whatsappNumber: string): string {
  const text = "Hi! I have a question about your products.";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// Used when an admin rejects a payment proof -- the order number is what
// support needs first, so it's pre-filled rather than making the customer
// dig it out of their email.
export function paymentIssueWhatsAppLink(whatsappNumber: string, orderNumber: string): string {
  const text = `Hi! I need help with the payment for my order ${orderNumber}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// WhatsApp's wa.me links can only pre-fill text, not attach an image, so
// this can't attach the screenshot itself -- it pre-fills the order number
// and prompts the customer to attach the screenshot manually, for anyone
// who'd rather send it this way than upload it in-app (both work; in-app
// upload is not required to place or track an order).
export function paymentProofWhatsAppLink(whatsappNumber: string, orderNumber: string): string {
  const text = `Hi! Here's my payment screenshot for order ${orderNumber}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// Lets a guest on the track page hand a specific order straight to support
// without retyping the order number -- pre-fills it (and its status, so
// support has context before the customer even finishes typing) rather than
// a generic "I have a question" message.
export function orderTrackingWhatsAppLink(whatsappNumber: string, orderNumber: string, status: string): string {
  const text = `Hi! I'd like an update on my order ${orderNumber} (currently: ${status}).`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// `template`, when set, is the vendor's own copy from Settings
// (business_settings.whatsapp_order_message_template) -- supports {product}
// and {size} placeholders so a vendor can write their own message without
// touching code. Falls back to the original fixed copy for every vendor who
// hasn't set one.
export function productOrderWhatsAppLink(
  whatsappNumber: string,
  productName: string,
  boxSizeKg?: number,
  template?: string | null
): string {
  const sizeNote = boxSizeKg ? ` (${boxSizeKg}kg box)` : "";
  const text = template
    ? template.replaceAll("{product}", productName).replaceAll("{size}", boxSizeKg ? `${boxSizeKg}kg` : "")
    : `Hi! I'd like to order ${productName}${sizeNote}. Is it available?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
