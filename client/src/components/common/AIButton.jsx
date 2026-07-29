import { Sparkles } from "lucide-react";

const AIButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-black px-5 py-4 text-white shadow-xl transition hover:scale-105"
    >
      <Sparkles size={20} />
      AI Assistant
    </button>
  );
};

export default AIButton;