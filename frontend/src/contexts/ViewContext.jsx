// ViewContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { searchSchoolsByName, getAllSchoolSchedule } from "../api/schoolApi";
import { searchAverageScheduleByGrade } from "../api/regionApi";
import { SearchTypeContext } from "./SearchTypeContext";

export const ViewContext = createContext();

const ViewProvider = ({ children }) => {
    const { searchType, setSchoolAdress } = useContext(SearchTypeContext);
    const [currentView, setCurrentView] = useState("monthly");
    const [selectedValue, setSelectedValue] = useState("");
    const [schedules, setSchedules] = useState(null);

    const isInitialMount = useRef(true); // 최초 마운트 여부

    useEffect(() => {
        const fetchDefaultSchedule = async () => {
            try {
                if (searchType.type === "school") {
                    const defaultSchoolName = "가락중학교";
                    const shouldReset =
                        isInitialMount.current ||
                        selectedValue === "" ||
                        (searchType.type === "school" &&
                            !selectedValue.includes("학교"));

                    const schoolName = shouldReset
                        ? defaultSchoolName
                        : selectedValue;

                    if (shouldReset) setSelectedValue(defaultSchoolName);

                    const school = await searchSchoolsByName(schoolName);
                    const schoolCode = school.data[0].schoolCode;

                    const res = await getAllSchoolSchedule(
                        schoolCode,
                        school.data[0].atptCode, // 💡 atptCode도 같이 넘겨야 함
                        searchType.year,
                        searchType.grade
                    );

                    setSchedules(res.data);
                } else {
                    setSchoolAdress("서울특별시 송파구 송이로 45");
                    const defaultRegion = "서울특별시 강남구";
                    const shouldReset =
                        isInitialMount.current ||
                        selectedValue === "" ||
                        (searchType.type === "region" &&
                            selectedValue.includes("학교"));

                    const regionName = shouldReset
                        ? defaultRegion
                        : selectedValue;

                    if (shouldReset) setSelectedValue(defaultRegion);

                    const res = searchType.grade
                        ? await searchAverageScheduleByGrade(
                              regionName,
                              searchType.grade
                          )
                        : await searchAverageScheduleByGrade(regionName);

                    setSchedules(res.data.data);
                }
            } catch (err) {
                console.error("❌ 학사일정 불러오기 실패", err);
                setSchedules([]);
            } finally {
                isInitialMount.current = false;
            }
        };

        fetchDefaultSchedule();
    }, [searchType.type, searchType.year, searchType.grade]);

    return (
        <ViewContext.Provider
            value={{
                currentView,
                setCurrentView,
                selectedValue,
                setSelectedValue,
                schedules,
                setSchedules,
            }}>
            {children}
        </ViewContext.Provider>
    );
};

export default ViewProvider;

// import { useContext, createContext, useState, useEffect } from "react";
// import {
//     searchSchoolsByName,
//     getSchoolScheduleByGrade,
//     getPrevSchoolScheduleByGrade,
// } from "../api/schoolApi";
// import { searchAverageScheduleByGrade } from "../api/regionApi";
// import { SearchTypeContext } from "./SearchTypeContext";

// export const ViewContext = createContext();

// const ViewProvider = ({ children }) => {
//     const { searchType, setSearchType } = useContext(SearchTypeContext);
//     // 현재 뷰 상태 관리
//     const [currentView, setCurrentView] = useState("monthly");
//     // 선택한 학교 혹은 지역명
//     const [selectedValue, setSelectedValue] = useState(
//         searchType.type === "school" ? "가락중학교" : "서울특별시 강남구"
//     );
//     // 불러온 학사일정 데이터
//     const [schedules, setSchedules] = useState(null);

//     const schoolCode = 7130165; // 초기 학교 코드
//     const regionName = "서울특별시 강남구";

//     useEffect(() => {
//         if (searchType.type === "school") {
//             setSearchType((prev) => ({
//                 ...prev,
//                 schoolType: "middle",
//             }));
//         } else {
//             setSearchType((prev) => ({
//                 ...prev,
//                 schoolType: "elementary",
//             }));
//         }
//     }, [searchType.type]);

//     useEffect(() => {
//         const fetchSchedules = async () => {
//             try {
//                 if (searchType.type === "school") {
//                     const response = await getSchoolScheduleByGrade(
//                         schoolCode,
//                         searchType.grade
//                     );
//                     setSelectedValue("가락중학교");
//                     setSchedules(response.data);
//                 } else {
//                     const response = await searchAverageScheduleByGrade(
//                         regionName,
//                         searchType.grade
//                     );
//                     setSelectedValue(regionName);
//                     setSchedules(response.data.data);
//                 }
//             } catch (error) {
//                 console.error("학사일정 불러오기 실패:", error);
//                 setSchedules([]);
//             }
//         };

//         fetchSchedules();
//     }, [searchType.type]);

//     useEffect(() => {
//         // console.log("학년 또는 학교 타입이 변경되어 재렌더링");
//         const fetchSchedules = async () => {
//             try {
//                 if (searchType.type === "school") {
//                     if (!searchType.year) {
//                         const school = await searchSchoolsByName(selectedValue);
//                         // console.log("schoolCode = ", school.data[0].schoolCode);
//                         const response = await getSchoolScheduleByGrade(
//                             school.data[0].schoolCode,
//                             searchType.grade
//                         );
//                         setSelectedValue(selectedValue);
//                         setSchedules(response.data);
//                     } else {
//                         const school = await searchSchoolsByName(selectedValue);
//                         // console.log("schoolCode = ", school.data[0].schoolCode);
//                         const response = await getPrevSchoolScheduleByGrade(
//                             school.data[0].schoolCode,
//                             searchType.grade
//                         );
//                         setSelectedValue(selectedValue);
//                         setSchedules(response.data);
//                         console.log("작년 학사 일정: ", response.data);
//                     }
//                 } else {
//                     console.log(selectedValue);
//                     setSearchType((prev) => ({
//                         ...prev,
//                         year: null,
//                     }));
//                     const response = await searchAverageScheduleByGrade(
//                         selectedValue,
//                         searchType.grade
//                     );
//                     setSelectedValue(selectedValue);
//                     setSchedules(response.data.data);
//                 }
//             } catch (error) {
//                 console.error("학사일정 불러오기 실패:", error);
//                 setSchedules([]);
//             }
//         };

//         fetchSchedules();
//     }, [
//         searchType.grade,
//         searchType.schoolType,
//         searchType.year,
//         selectedValue,
//     ]);

//     return (
//         <ViewContext.Provider
//             value={{
//                 currentView,
//                 setCurrentView,
//                 selectedValue,
//                 setSelectedValue,
//                 schedules,
//                 setSchedules,
//             }}>
//             {children}
//         </ViewContext.Provider>
//     );
// };

// export default ViewProvider;
