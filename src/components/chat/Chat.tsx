"use client";
import React, { useState, useEffect, useRef } from "react";
import PromptBar from "./PromptBar";
import axios from "axios";
import MessageBox from "./MessageBox";
function Chat() {
  interface Message {
    role: string;
    message: string;
    timestamp?: Date;
    id?: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateMentorResponse = async (userMessage: string) => {
    if (!userMessage) return null;
    setIsTyping(true);
    const getActiveChat = localStorage.getItem("activeChat");
    if (!getActiveChat) return null;
    let collection = "default_collection";
    const allChats = JSON.parse(localStorage.getItem("chats")) || [];
    allChats.map((chat, index) => {
      if (chat.id === getActiveChat) {
        collection = chat.collection;
      }
    });
    const response = await axios.get(
      `/api/generate?query=${userMessage}&db=${collection}`
    );

    console.log(response);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "SYSTEM",
        message: response.data.answer.replaceAll("\\n"),
      },
    ]);
    setIsTyping(false);
  };
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === "USER") {
        simulateMentorResponse(latestMessage.message);
      }
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        role: "SYSTEM",
        message: `Hi There ! Let's get it going?`,
        timestamp: new Date(),
        id: `clear-${Date.now()}`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800/90 backdrop-blur-xl border-b border-orange-500/20 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"></div>

            <div className="flex items-center gap-3">
              {/* Message Counter */}
              <div className="text-sm text-orange-300 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-500/30 shadow-lg">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {messages.length} messages
                </span>
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/60 hover:bg-red-500/20 hover:text-red-300 rounded-lg border border-gray-600/50 hover:border-red-500/50 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-red-500/20"
              >
                <svg
                  className="w-4 h-4 group-hover:animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear Chat
              </button>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/AngadSudan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/angadsudan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth bg-gradient-to-b from-gray-900/50 to-slate-900/80"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#FB923C #1F2937",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Welcome Message */}
          {messages.length <= 1 && (
            <div className="text-center py-16">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                {/* Animated background rings */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-spin opacity-20"
                  style={{ animationDuration: "3s" }}
                ></div>
                <div
                  className="absolute inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-spin opacity-30"
                  style={{
                    animationDuration: "2s",
                    animationDirection: "reverse",
                  }}
                ></div>

                {/* Main icon container */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                Welcome to ChaiCode Mentorship
              </h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                Start coding conversations with your mentor. Ask questions, seek
                guidance, or discuss any{" "}
                <span className="text-orange-400 font-mono">programming</span>{" "}
                topics you'd like to explore.
              </p>

              {/* Code-like decoration */}
              <div className="mt-6 text-xs font-mono text-gray-600 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 inline-block">
                <span className="text-orange-400">const</span>{" "}
                <span className="text-blue-400">mentorship</span> = {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-green-400">status</span>:{" "}
                <span className="text-yellow-400">"ready"</span>,
                <br />
                &nbsp;&nbsp;<span className="text-green-400">mode</span>:{" "}
                <span className="text-yellow-400">"interactive"</span>
                <br />
                {"}"};
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <MessageBox
              role={message.role as string}
              message={message.message}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start py-4 px-4">
              <div className="flex items-center gap-4 max-w-[85%]">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border border-orange-500/20 rounded-tr-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-white animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      <span className="text-orange-400 font-medium">
                        ChaiNote
                      </span>
                      <span className="text-gray-400">
                        {" "}
                        is crafting response
                      </span>
                    </span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce shadow-lg"></span>
                      <span
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce shadow-lg"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce shadow-lg"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  {/* Typing pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-ping"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-gray-800/90 backdrop-blur-xl border-t border-orange-500/20">
        <PromptBar messages={messages} setMessages={setMessages} />
      </div>

      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #f59e0b);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(251, 146, 60, 0.3);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #d97706);
          box-shadow: 0 0 15px rgba(251, 146, 60, 0.5);
        }

        /* Additional glow effects */
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(251, 146, 60, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.6);
          }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Chat;
