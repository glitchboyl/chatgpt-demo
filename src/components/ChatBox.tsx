import { useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import MessageBlock from "./MessageBlock";
import InputBox from "./InputBox";
import { sendMessagesToGPT, type MessageModel } from "../api/chat";
import { useApiKey } from "../api/key";

const ChatBox = () => {
  const [messages, setMessages] = useState<MessageModel[]>([
    {
      content: "Hello, I am ChatGPT! Ask me everything.",
      role: "system",
      type: "info",
    },
  ]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [API_KEY] = useApiKey();

  const handleSendMessage = useCallback(
    (content: string) => {
      if (messages[messages.length - 1].type !== "typing") {
        const newMessages = [
          ...messages,
          {
            content,
            role: "user" as const,
            type: "info" as const,
          },
        ];
        setMessages([
          ...newMessages,
          {
            content: "",
            role: "assistant",
            type: "typing" as const,
          },
        ]);
        fetchMessages(newMessages);
      }
    },
    [messages]
  );

  const handleRegenerate = useCallback(() => {
    const newMessages = messages.slice(0, messages.length - 1);
    setMessages([
      ...newMessages,
      {
        content: "",
        role: "assistant",
        type: "typing" as const,
      },
    ]);
    fetchMessages(newMessages);
  }, [messages]);

  const fetchMessages = useCallback(
    async (newMessages: MessageModel[]) => {
      try {
        const chatMessages = newMessages
          .filter((message) => message.type === "info")
          .map(({ role, content }) => ({ role, content }));
        const completion = await sendMessagesToGPT(chatMessages, API_KEY);
        setMessages([
          ...newMessages,
          completion.hasOwnProperty("choices")
            ? {
                ...completion.choices[0].message,
                type: "info",
              }
            : {
                content: completion.error.message,
                role: "assistant",
                type: "error",
              },
        ]);
      } catch (err: any) {
        setMessages([
          ...newMessages,
          {
            content: err.message,
            role: "assistant" as const,
            type: "error" as const,
          },
        ]);
      }
    },
    [API_KEY]
  );

  const handleFinishTyping = useCallback(
    (i: number) => {
      if (messages[i].type === "typing") {
        messages[i].type = "info" as const;
        setMessages([...messages]);
      }
    },
    [messages]
  );

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        sx={{ flexGrow: 1, overflow: "auto", position: "relative" }}
      >
        <Box
          width="100%"
          maxWidth="md"
          sx={{
            px: {
              xs: 2,
              sm: 6,
            },
          }}
          ref={chatBoxRef}
        >
          {messages.map((message, i) => (
            <MessageBlock
              model={message}
              onFinishTyping={() => handleFinishTyping(i)}
              key={i}
            />
          ))}
        </Box>
      </Box>
      <InputBox
        type={messages[messages.length - 1].type}
        onSendMessage={handleSendMessage}
        onRegenerate={handleRegenerate}
      />
    </>
  );
};

export default ChatBox;
