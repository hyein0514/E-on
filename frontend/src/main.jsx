import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthContext.jsx";
import CurrentDateProvider from "./contexts/CurrentDateContext.jsx";
import ViewProvider from "./contexts/ViewContext.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ViewProvider>
            <CurrentDateProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </CurrentDateProvider>
        </ViewProvider>
    </BrowserRouter>
);
