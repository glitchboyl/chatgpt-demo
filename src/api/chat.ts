export type MessageModel = {
  content: string;
  role: "user" | "assistant" | "system";
  type: "info" | "error" | "typing";
};

export const sendMessagesToGPT = async (
  chatMessages: Omit<MessageModel, "type">[],
  API_KEY: string
) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [...chatMessages],
      }),
    });
    if (!res.ok)
      throw new Error("Unauthorized access. Please input a valid OpenAI key.");
    return res.json();
  } catch (err: any) {
    throw new Error(err);
  }
};
