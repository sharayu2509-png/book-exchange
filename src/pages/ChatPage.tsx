import { MessageSquare, Search, Send, UserCircle2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

const conversations = [
  {
    id: 1,
    name: 'Nisha',
    college: 'IIT Delhi',
    lastMessage: 'Is the DSA book still available?',
    time: '2m',
  },
  {
    id: 2,
    name: 'Rohit',
    college: 'AIIMS',
    lastMessage: 'Can you share a picture of the cover?',
    time: '18m',
  },
  {
    id: 3,
    name: 'Pooja',
    college: 'Delhi University',
    lastMessage: 'I can meet tomorrow afternoon.',
    time: '1h',
  },
];

const messages = [
  { id: 1, from: 'seller', text: 'Hi! The book is in great condition and still available.' },
  { id: 2, from: 'me', text: 'Perfect, can you confirm the price and exchange option?' },
  { id: 3, from: 'seller', text: 'Yes, the listed price is final and exchange is possible.' },
];

export const ChatPage = () => {
  if (!conversations.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <EmptyState
          title="No conversations yet"
          description="When you contact a seller, your chats will appear here with quick access to the message thread."
          actionLabel="Browse books"
          actionTo="/library"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <div className="grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="rounded-[28px] border border-border bg-white p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <MessageSquare size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text">Messages</h1>
              <p className="text-sm text-subtext">Responsive inbox for seller conversations</p>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3">
            <Search size={18} className="text-subtext" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search conversations" />
          </label>

          <div className="mt-4 space-y-3">
            {conversations.map((conversation, index) => (
              <button
                key={conversation.id}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  index === 0 ? 'border-primary bg-primary/5' : 'border-border bg-white hover:bg-bg'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <UserCircle2 size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold text-text">{conversation.name}</p>
                      <span className="text-xs text-subtext">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-subtext">{conversation.college}</p>
                    <p className="mt-1 truncate text-sm text-text">{conversation.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-soft">
          <div className="border-b border-border px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-text">Nisha</h2>
                <p className="text-sm text-subtext">IIT Delhi • online now</p>
              </div>
              <div className="rounded-2xl bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary">
                Active chat
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-bg/40 p-4 sm:p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[70%] ${
                    message.from === 'me' ? 'bg-primary text-white' : 'bg-white text-text'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-white p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="min-h-12 flex-1 rounded-2xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Type your message"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01]">
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
