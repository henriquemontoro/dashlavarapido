export const config = {
  apiBaseUrl:
    window.location.origin === "http://localhost:5173"
      ? "http://localhost:8010"
      : import.meta.env.VITE_API_BASE_URL,
  assistenteWebhookUrl: import.meta.env.VITE_ASSISTENTE_WEBHOOK_URL,
  assistenteWebhookSecret: import.meta.env.VITE_ASSISTENTE_WEBHOOK_SECRET,
}
