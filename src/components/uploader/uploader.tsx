"use client";
import { useState, useEffect } from "react";
import { Upload, Link, Type, MessageCircle, Loader2, Plus } from "lucide-react";

export default function UploadChatComponent() {
  const [uploadType, setUploadType] = useState("document");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [dbCollection, setDbCollection] = useState("default");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats") || "[]");
    setChats(savedChats);
    const savedActiveChat = localStorage.getItem("activeChat");
    if (savedActiveChat) setActiveChat(savedActiveChat as any);
  }, []);

  const saveToStorage = (newChats: any, newActiveChat = null) => {
    localStorage.setItem("chats", JSON.stringify(newChats));
    if (newActiveChat) localStorage.setItem("activeChat", newActiveChat);
    setChats(newChats);
    if (newActiveChat) setActiveChat(newActiveChat);
  };

  const handleUpload = async () => {
    if (!file && !url && !text) {
      alert("Please provide a file, URL, or text");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("db", dbCollection);

      if (uploadType === "document" && file) {
        formData.append("file", file);
      } else if (uploadType === "url" && url) {
        formData.append("url", url);
      } else if (uploadType === "text" && text) {
        const textBlob = new Blob([text], { type: "text/plain" });
        const textFile = new File([textBlob], "input.txt", {
          type: "text/plain",
        });
        formData.append("file", textFile);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newChat = {
          id: Date.now().toString(),
          name: getDisplayName(result),
          type: uploadType,
          collection: dbCollection,
          createdAt: new Date().toISOString(),
          data: {
            file: result.file || null,
            url: result.url || null,
            text: uploadType === "text" ? text : null,
          },
        };

        const updatedChats = [newChat, ...chats];
        saveToStorage(updatedChats, newChat.id as any);

        setFile(null);
        setUrl("");
        setText("");
        setShowUploadForm(false);

        alert("Upload successful!");
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const getDisplayName = (result: any) => {
    if (result.file) return result.file;
    if (result.url) return new URL(result.url).hostname;
    return "Text Input";
  };

  const handleChatClick = (chat: any) => {
    setActiveChat(chat.id);
    localStorage.setItem("activeChat", chat.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUploadIcon = () => {
    switch (uploadType) {
      case "document":
        return <Upload className="w-5 h-5" />;
      case "url":
        return <Link className="w-5 h-5" />;
      case "text":
        return <Type className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
      <div className="space-y-8">
        {/* Button to Toggle Upload Form */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ChaiNoteLLM
          </h2>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition"
          >
            <Plus className="w-5 h-5" />
            <span>New Upload</span>
          </button>
        </div>

        {/* Upload Section (Hidden by default) */}
        {showUploadForm && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">
              Upload Content
            </h2>

            {/* Database Collection Input */}
            <div className="mb-3">
              <input
                type="text"
                value={dbCollection}
                onChange={(e) => setDbCollection(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400"
                placeholder="Collection name"
              />
            </div>

            {/* Upload Type Dropdown */}
            <div className="mb-3">
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400"
              >
                <option value="document">Document (PDF/TXT)</option>
                <option value="url">URL</option>
                <option value="text">Text Input</option>
              </select>
            </div>

            {/* Conditional Input Fields */}
            {uploadType === "document" && (
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-gray-300 mb-3"
              />
            )}

            {uploadType === "url" && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 mb-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400"
              />
            )}

            {uploadType === "text" && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                rows={4}
                className="w-full px-3 py-2 mb-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 resize-none"
              />
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading || (!file && !url && !text)}
              className="flex items-center justify-center space-x-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                getUploadIcon()
              )}
              <span>{isUploading ? "Uploading..." : "Upload"}</span>
            </button>
          </div>
        )}

        {/* Chat History Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No chats yet. Upload some content to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition ${
                    activeChat === chat.id ? "bg-gray-800/70" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {chat.type === "document" && (
                      <Upload className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    )}
                    {chat.type === "url" && (
                      <Link className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {chat.type === "text" && (
                      <Type className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{chat.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {formatDate(chat.createdAt)}
                      </p>
                    </div>
                  </div>
                  {activeChat === chat.id && (
                    <span className="text-xs text-cyan-400">●</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Chat Display */}
        {activeChat && (
          <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30 shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-300 mb-1">
              Active Chat
            </h3>
            <p className="text-emerald-200 text-sm">Chat ID: {activeChat}</p>
            <p className="text-xs text-emerald-400 mt-1">
              You can now start chatting with this vectorized content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
