import { createContext, useState } from "react";

export const ViewContext = createContext();

const ViewProvider = ({ children }) => {
    // 현재 뷰 상태 관리
    const [currentView, setCurrentView] = useState("monthly");

    return (
        <ViewContext.Provider value={{ currentView, setCurrentView }}>
            {children}
        </ViewContext.Provider>
    );
}

export default ViewProvider;