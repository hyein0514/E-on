import { createContext, useState } from "react";

export const SearchTypeContext = createContext();

const SearchTypeProvider = ({ children }) => {
    // 현재 검색 타입 상태 관리
    const [searchType, setSearchType] = useState({
        type: "school", //"school" 또는 "region", 기본형 "school"
        grade: 1, // 숫자형 학년 정보 (1~6학년 가능, 중학교는 1~3학년만만)
    });

    return (
        <SearchTypeContext.Provider value={{ searchType, setSearchType }}>
            {children}
        </SearchTypeContext.Provider>
    );
};

export default SearchTypeProvider;
