
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import App from "./App";
import "@fontsource/inter";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
     <AuthProvider>
        <Toaster position="top-right" />
        <App />

     </AuthProvider>
        
    </BrowserRouter>
);