import React, { useState, useEffect, useRef } from 'react';
import { Send, Flame } from 'lucide-react';
import { chatWithNutriGPT } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';

interface DashboardProps {
    userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hey ${userProfile.name}! 👋 NutriGPT here. Ready to crush your ${userProfile.goal} goals today? What's on your mind? 🥗`,
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        // Prepare history for API
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await chatWithNutriGPT(input, history);
        
        const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
        setMessages(prev => [...prev, botMsg]);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const QuickChip = ({ text, onClick }: { text: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="px-4 py-2 bg-white border-2 border-emerald-100 rounded-full text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap"
    >
        {text}
    </button>
  );

  return (
    <div className="h-full flex flex-col relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-3xl shadow-sm">
        <div>
            <h2 className="text-2xl font-extrabold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Let's talk nutrition!</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-2xl text-orange-600 font-bold animate-pulse">
            <Flame size={20} className="fill-orange-500" />
            <span>12 Day Streak!</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-[80%] p-4 rounded-2xl shadow-sm text-base leading-relaxed
                ${msg.role === 'user' 
                    ? 'bg-nutri-lavender text-purple-900 rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-nutri-mint rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-nutri-sunshine rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-nutri-coral rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
        <QuickChip text="How am I doing today?" onClick={() => setInput("How am I doing today based on my logs?")} />
        <QuickChip text="Give me a snack idea! 🍎" onClick={() => setInput("I need a healthy snack idea that fits my plan!")} />
        <QuickChip text="Explain Macro splits" onClick={() => setInput("Can you explain my macro splits simply?")} />
      </div>

      {/* Input Area */}
      <div className="p-2 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center gap-2">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask NutriGPT anything..."
            className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
                p-3 rounded-full text-white transition-all transform hover:scale-105 active:scale-95
                ${!input.trim() ? 'bg-gray-300' : 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200'}
            `}
        >
            <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
