import React, { useState } from "react";
import { Send } from "lucide-react";

function PromptBar({ messages, setMessages, handleSubmitOption }: any) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (input.trim()) {
      if (handleSubmitOption) {
        handleSubmitOption(input.trim());
      }

      const newMessage = {
        id: Date.now(),
        message: input.trim(),
        timestamp: new Date(),
        role: "USER",
      };

      setMessages((prev: any) => [...prev, newMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 focus-within:border-orange-500 transition-colors duration-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none rounded-l-lg"
            />

            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={`p-3 rounded-r-lg transition-all duration-200 ${
                input.trim()
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptBar;
