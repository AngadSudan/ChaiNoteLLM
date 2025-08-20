interface MessageBoxProps {
  role: "HITESH_SIR" | "PIYUSH_SIR" | "USER" | string;
  message: string;
  profile?: string;
}

function getMentorName(role: string): string {
  switch (role) {
    case "HITESH_SIR":
      return "Hitesh";
    case "PIYUSH_SIR":
      return "Piyush";
    case "USER":
      return "You";
    default:
      return "Mentor";
  }
}

function MessageBox({ role, message, profile }: MessageBoxProps) {
  const isUser = role === "USER";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} py-4 px-4`}
    >
      <div
        className={`flex items-start gap-4 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full ${
              isUser
                ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/25"
                : "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-lg shadow-teal-500/25"
            } p-0.5 ring-2 ${
              isUser ? "ring-cyan-500/30" : "ring-teal-500/30"
            } ring-offset-2 ring-offset-gray-900`}
          >
            <img
              src={profile || "/placeholder.svg"}
              className="w-full h-full rounded-full object-cover"
              alt={`${getMentorName(role)}-avatar`}
            />
          </div>
        </div>

        <div
          className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          <div
            className={`text-xs mb-2 px-2 font-medium ${
              isUser ? "text-cyan-400" : "text-teal-400"
            }`}
          >
            {getMentorName(role)}
          </div>

          <div
            className={`rounded-2xl px-6 py-4 backdrop-blur-sm border relative overflow-hidden ${
              isUser
                ? "bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-cyan-500/20 rounded-br-sm text-gray-100 shadow-xl shadow-cyan-500/10"
                : "bg-gradient-to-br from-gray-800/90 to-black/90 border-teal-500/20 rounded-tl-sm text-gray-200 shadow-xl shadow-teal-500/10"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-2xl ${
                isUser
                  ? "bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"
                  : "bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5"
              } pointer-events-none`}
            ></div>

            <div className="relative z-10 text-sm leading-relaxed whitespace-pre-wrap font-medium tracking-wide">
              {message}
            </div>

            <div
              className={`absolute bottom-0 left-0 h-0.5 w-full ${
                isUser
                  ? "bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                  : "bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
