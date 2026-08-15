import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIButton = () => {

    const navigate = useNavigate();

    const handleAI = () => {
        navigate("/ai");
    };

    return (

        <button
            type="button"
            onClick={handleAI}
            className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-black px-5 py-4 text-white shadow-xl transition hover:scale-105"
        >

            <Sparkles size={20} />

            AI Assistant

        </button>

    );

};

export default AIButton;