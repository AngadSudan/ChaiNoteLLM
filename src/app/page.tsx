import Chat from "@/components/chat/Chat";
import UploadChatComponent from "@/components/uploader/uploader";
export default function Home() {
  return (
    <div className="flex gap-[1px] h-screen">
      <div className="w-1/2 h-screen">
        <UploadChatComponent />
      </div>
      <div className="w-1/2 h-screen">
        <Chat />
      </div>
    </div>
  );
}
