import styles from "../../styles/Calendar/ViewNavigator.module.css";
import { useContext, useEffect } from "react";
import { ViewContext } from "../../contexts/ViewContext";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import dayjs from "dayjs";

const ViewNavigator = () => {
    const { selectedValue, currentView, setCurrentView } =
        useContext(ViewContext);
    const { searchType, setSearchType } = useContext(SearchTypeContext);
    const { currentDate, setCurrentDate } = useContext(CurrentDateContext);

    const handleViewTypeChange = (event) => {
        setCurrentView(event.target.value);
    };

    useEffect(() => {
        if (searchType.year === "prev") {
            // currentDate를 1년 전으로 변경
            setCurrentDate(currentDate.subtract(1, "year"));
        } else {
            // 올해(현재 날짜)로 복원
            setCurrentDate(dayjs());
        }
    }, [searchType.year, setCurrentDate]);

    return (
        <div className={styles.viewNavigator}>
            <div className={styles.left}>
                <div className={styles.name}>{selectedValue}</div>
                <div className={styles.text}>학사일정</div>
                <div className={styles.selectGrade}>
                    <select
                        className={styles.select}
                        onChange={(e) => {
                            const selectedGrade = parseInt(e.target.value, 10); // 문자열 → 10진법 숫자
                            setSearchType((prev) => ({
                                ...prev,
                                grade: selectedGrade,
                            }));
                        }}
                        value={searchType.grade || 1} // 초기값 세팅
                    >
                        {[1, 2, 3, 4, 5, 6]
                            .filter((grade) =>
                                searchType.schoolType === "middle"
                                    ? grade <= 3
                                    : true
                            )
                            .map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade}
                                </option>
                            ))}
                    </select>
                    <span className={styles.selectText}>학년</span>
                </div>
                <div
                    className={styles.chooseYearView}
                    onClick={() => {
                        if (searchType.type === "region") {
                            setSearchType((prev) => ({
                                ...prev,
                                schoolType:
                                    prev.schoolType === "elementary"
                                        ? "middle"
                                        : "elementary",
                            }));
                        } else {
                            setSearchType((prev) => ({
                                ...prev,
                                year: prev.year === "prev" ? null : "prev",
                            }));
                        }
                    }}>
                    {searchType.type === "region"
                        ? searchType.schoolType === "elementary"
                            ? "→ 중학교 학사일정 보러가기"
                            : "→ 초등학교 학사일정 보러가기"
                        : searchType.year === "prev"
                        ? "→ 올해 학사일정 보러가기"
                        : "→ 작년 학사일정 보러가기"}
                </div>
            </div>
            <div className={styles.viewRadio}>
                <label>
                    <input
                        type="radio"
                        name="viewType"
                        value="monthly"
                        checked={currentView == "monthly"}
                        onChange={handleViewTypeChange}
                    />
                    한달 보기
                </label>
                <label>
                    <input
                        type="radio"
                        name="viewType"
                        value="weekly"
                        checked={currentView === "weekly"}
                        onChange={handleViewTypeChange}
                    />
                    일주일 보기
                </label>
            </div>
        </div>
    );
};

export default ViewNavigator;
