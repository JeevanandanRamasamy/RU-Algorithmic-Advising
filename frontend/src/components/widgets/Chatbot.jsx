import React, { useState, useEffect, useRef } from "react";
import { SparklesIcon, CpuChipIcon } from "@heroicons/react/24/solid";
import useAIChat from "../../hooks/useAIChat";
import { motion } from "framer-motion"; // for animations
import ReactMarkdown from "react-markdown"; // for rendering markdown

const ChatPanel = ({ messages, input, setInput, sendMessage, onClose, loading }) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages come
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-8 z-50 w-80 h-[450px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col"
        >
            <div className="p-4 border-b bg-[#cc0033] rounded-t-xl flex items-center gap-2">
                <CpuChipIcon className="w-5 h-5 text-[#fcf8d7]" />
                <span className="font-semibold text-[#fcf8d7]">Algorithmic Advisor</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
                {messages.length === 0 && !loading && (
                    <div className="mr-auto bg-[#f1f5f9] px-3 py-1 rounded-2xl shadow-sm max-w-[75%] text-gray-800 rounded-bl-sm">
                        <ReactMarkdown>Hi there! How can I help you today?</ReactMarkdown>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[75%] px-3 py-1 rounded-2xl shadow-sm ${msg.sender === "user"
                            ? "ml-auto bg-[#cc0033] text-white rounded-br-sm"
                            : "mr-auto bg-[#f1f5f9] text-gray-800 rounded-bl-sm"
                            }`}
                    >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div className="mr-auto bg-[#f1f5f9] px-3 py-1 rounded-2xl shadow-sm max-w-[75%] flex gap-1 text-gray-500">
                        <span className="animate-bounce delay-75">.</span>
                        <span className="animate-bounce delay-150">.</span>
                        <span className="animate-bounce delay-300">.</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#cc0033]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask something..."
                />
                <button
                    className="bg-[#cc0033] text-white px-3 py-1 rounded text-sm hover:bg-[#a80028]"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
            {/* Powered by Gemini text */}
            <div className="text-center text-xs text-gray-400 p-1">
                Powered by <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#cc0033] hover:underline">Gemini</a>
            </div>
        </motion.div>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasLoadedUserInfo, setHasLoadedUserInfo] = useState(false);
    const { messages, input, setInput, sendMessage, loading, setUserInfo } = useAIChat();

    useEffect(() => {
        if (isOpen && !hasLoadedUserInfo) {
            // Load user info the first time the chat panel opens
            setUserInfo();
            setHasLoadedUserInfo(true); // Mark as loaded
        }
    }, [isOpen, hasLoadedUserInfo, setUserInfo]);

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }} // Slight hover effect
                whileTap={{ scale: 0.90 }}  // Scale tap (press animation)
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-[1rem] border border-gray-200 shadow-md bg-white group flex items-center justify-center transition-colors duration-200"
            >
                <SparklesIcon className="w-6 h-6 text-[#cc0033] transition-colors duration-200 group-hover:text-[#fcf8d7]" />
                <div className="absolute inset-0 rounded-[1rem] bg-transparent group-hover:bg-[#cc0033] transition-colors duration-200 -z-10"></div>
            </motion.button>

            {isOpen && (
                <ChatPanel
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    onClose={() => setIsOpen(false)}
                    loading={loading}
                />
            )}
        </>
    );
};

export default Chatbot;