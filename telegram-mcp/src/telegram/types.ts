type Chat = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
};

type Message = {
  from: User;
  message: string;
  date: string;
};

type Messages = Message[];

type Chats = Chat[];

type ChatMessages = {
  chat: Chat;
  messages: Messages;
};

type ChatsMessages = ChatMessages[];

function createChat(id: string, name: string): Chat {
  return { id, name };
}

function createChatMessages(id: string, name: string): ChatMessages {
  return { chat: createChat(id, name), messages: [] };
}

function createMessage(userId: string, userName: string, message: string, date: string): Message {
  return {
    from: { id: userId, name: userName },
    message,
    date
  };
}

export const Types = {
  createChat,
  createChatMessages,
  createMessage
} as const;

export type { Chat, User, Message, Messages, Chats, ChatsMessages, ChatMessages };
