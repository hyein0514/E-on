import { useContext, createContext, useState, useEffect } from "react";
import {
    searchSchoolsByName,
    getSchoolScheduleByGrade,
    getPrevSchoolScheduleByGrade,
} from "../api/schoolApi";
import { searchAverageScheduleByGrade } from "../api/regionApi";
import { SearchTypeContext } from "./SearchTypeContext";

export const ViewContext = createContext();

const ViewProvider = ({ children }) => {
    const { searchType, setSearchType } = useContext(SearchTypeContext);
    // 현재 뷰 상태 관리
    const [currentView, setCurrentView] = useState("monthly");
    // 선택한 학교 혹은 지역명
    const [selectedValue, setSelectedValue] = useState(
        searchType.type === "school" ? "가락중학교" : "서울특별시 강남구"
    );
    // 불러온 학사일정 데이터
    const [schedules, setSchedules] = useState(null);

    const schoolCode = 7130165; // 초기 학교 코드
    const regionName = "서울특별시 강남구";

    useEffect(() => {
        if (searchType.type === "school") {
            setSearchType((prev) => ({
                ...prev,
                schoolType: "middle",
            }));
        } else {
            setSearchType((prev) => ({
                ...prev,
                schoolType: "elementary",
            }));
        }
    }, [searchType.type]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                if (searchType.type === "school") {
                    const response = await getSchoolScheduleByGrade(
                        schoolCode,
                        searchType.grade
                    );
                    setSelectedValue("가락중학교");
                    setSchedules(response.data);
                } else {
                    const response = await searchAverageScheduleByGrade(
                        regionName,
                        searchType.grade
                    );
                    setSelectedValue(regionName);
                    setSchedules(response.data.data);
                }
            } catch (error) {
                console.error("학사일정 불러오기 실패:", error);
                setSchedules([]);
            }
        };

        fetchSchedules();
    }, [searchType.type]);

    useEffect(() => {
        // console.log("학년 또는 학교 타입이 변경되어 재렌더링");
        const fetchSchedules = async () => {
            try {
                if (searchType.type === "school") {
                    if (!searchType.year) {
                        const school = await searchSchoolsByName(selectedValue);
                        // console.log("schoolCode = ", school.data[0].schoolCode);
                        const response = await getSchoolScheduleByGrade(
                            school.data[0].schoolCode,
                            searchType.grade
                        );
                        setSelectedValue(selectedValue);
                        setSchedules(response.data);
                    } else {
                        const school = await searchSchoolsByName(selectedValue);
                        // console.log("schoolCode = ", school.data[0].schoolCode);
                        const response = await getPrevSchoolScheduleByGrade(
                            school.data[0].schoolCode,
                            searchType.grade
                        );
                        setSelectedValue(selectedValue);
                        setSchedules(response.data);
                        console.log("작년 학사 일정: ", response.data);
                    }
                } else {
                    console.log(selectedValue);
                    setSearchType((prev) => ({
                        ...prev,
                        year: null,
                    }));
                    const response = await searchAverageScheduleByGrade(
                        selectedValue,
                        searchType.grade
                    );
                    setSelectedValue(selectedValue);
                    setSchedules(response.data.data);
                }
            } catch (error) {
                console.error("학사일정 불러오기 실패:", error);
                setSchedules([]);
            }
        };

        fetchSchedules();
    }, [
        searchType.grade,
        searchType.schoolType,
        searchType.year,
        selectedValue,
    ]);

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
