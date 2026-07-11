'use client';

import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, Send, ArrowLeft, Wifi } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { getChatSocket, disconnectChatSocket } from '@/lib/chat-socket';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Conversation {
  id: string;
  buyer: { id: string; name: string };
  seller: { id: string; name: string };
  product?: { name: string };
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender: { name: string };
  createdAt: string;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState(searchParams.get('c') || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback((conversationId: string) => {
    api.get(`/chat/conversations/${conversationId}/messages`)
      .then((res) => setMessages(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/chat/conversations')
      .then((res) => {
        setConversations(res.data.data);
        const fromUrl = searchParams.get('c');
        if (fromUrl) {
          setActiveId(fromUrl);
        } else if (res.data.data.length) {
          setActiveId((prev) => prev || res.data.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, searchParams]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = getChatSocket(token);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onMessage);
    setConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onMessage);
      disconnectChatSocket();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !activeId) return;
    loadMessages(activeId);

    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('join', activeId);
  }, [user, activeId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || !activeId) return;
    const content = text.trim();
    setText('');

    const token = localStorage.getItem('token');
    if (token) {
      const socket = getChatSocket(token);
      if (socket.connected) {
        socket.emit('message', { conversationId: activeId, content });
        return;
      }
    }

    try {
      await api.post(`/chat/conversations/${activeId}/messages`, { content });
      loadMessages(activeId);
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const partner = (c: Conversation) => {
    if (!user) return '';
    return c.buyer.id === user.id ? c.seller.name : c.buyer.name;
  };

  if (!user) {
    return (
      <AuthPrompt
        title="Барои чат ворид шавед"
        description="Бо фурӯшандагон муколима кардан танҳо барои корбарони бақайдшуда."
        nextPath="/chat"
        icon="default"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="app-container py-4 flex flex-col h-[calc(100dvh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => router.back()} className="icon-box h-10 w-10"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-xl font-black flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-brand-600" /> Чат
        </h1>
        <span className={clsx(
          'ml-auto text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-full',
          connected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500',
        )}>
          <Wifi className="h-3 w-3" /> {connected ? 'Live' : 'Offline'}
        </span>
      </div>

      <div className="flex flex-1 gap-3 min-h-0">
        <div className="w-1/3 space-y-2 overflow-y-auto hidden sm:block">
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={clsx('card p-3 w-full text-left card-hover', activeId === c.id && 'ring-2 ring-brand-400')}
            >
              <p className="font-bold text-sm">{partner(c)}</p>
              {c.product && <p className="text-xs text-gray-400 truncate">{c.product.name}</p>}
            </button>
          ))}
          {conversations.length === 0 && <p className="text-sm text-gray-400">Чат нест</p>}
        </div>

        <div className="flex-1 card flex flex-col min-h-0">
          {activeId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={clsx('max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                    m.senderId === user?.id ? 'ml-auto bg-brand-600 text-white' : 'bg-gray-100 text-gray-900',
                  )}>
                    <p>{m.content}</p>
                    <p className="text-[10px] opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString('tg-TJ', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} className="input flex-1" placeholder="Паём..." />
                <button type="button" onClick={send} className="btn-brand px-4"><Send className="h-4 w-4" /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Чатро интихоб кунед</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
