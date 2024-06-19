import { create } from "zustand";

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (newMessage) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => id !== msg._id),
    })),
  contacts: [],
  addContact: (newContact) =>
    set((state) => ({ contacts: [...state.contacts, newContact] })),
  setContacts: (contacts) => set({ contacts }),
}));

export default useConversation;
