import { apiClient } from "./apiClient";

export const aiApi = {
  analyzeInteraction: async (payload) => {
    const { data } = await apiClient.post("/agent/summarize", {
      notes: payload.notes || payload.topicsDiscussed || "No notes provided",
      hcpName: payload.hcpName,
      topicsDiscussed: payload.topicsDiscussed
    });
    const sentiment = await apiClient.post("/agent/sentiment", { text: payload.notes || payload.topicsDiscussed || "" });
    return {
      summary: data.summary,
      sentiment: sentiment.data.sentiment,
      confidence: sentiment.data.confidence,
      entities: [payload.hcpName, payload.interactionType].filter(Boolean),
      suggestedActions: ["send brochure", "schedule follow-up", "share clinical trial"]
    };
  },
  chat: async (messages, draftInteraction) => {
    const latest = messages[messages.length - 1]?.content || "Help with this interaction";
    const { data } = await apiClient.post("/agent/chat", {
      message: latest,
      messages,
      draftInteraction
    });
    return {
      message: data.response,
      analysis: data.analysis
        ? {
            summary: data.analysis.summary,
            sentiment: data.analysis.sentiment,
            confidence: data.analysis.confidence,
            entities: [
              ...(data.analysis.extractedEntities?.doctors || []),
              ...(data.analysis.extractedEntities?.products || []),
              ...(data.analysis.extractedEntities?.diseases || [])
            ],
            suggestedActions: data.analysis.suggestedActions || []
          }
        : undefined
    };
  }
};
