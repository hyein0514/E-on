import styles from "../../styles/Calendar/SchoolSearchBar.module.css";
import { useState, useEffect, useCallback, useContext } from "react";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import { searchRegionByName } from "../../api/regionApi";
import {
    searchSchoolsByName,
    getSchoolSchedule,
    getSchoolScheduleByGrade,
} from "../../api/schoolApi";
import debounce from "lodash.debounce";

const SchoolSearchBar = () => {
    const { searchType, setSearchType } = useContext(SearchTypeContext);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const placeholder =
        searchType.type === "school"
            ? "학교 이름을 입력하세요"
            : "지역 이름을 입력하세요";

    // useEffect(() => {
    //     console.log("SearchTypeContext: ", searchType);
    // }, [searchType]);

    // 입력 값이 변경될 때마다 검색 API 호출을 디바운스 처리
    const debouncedSearch = useCallback(
        debounce(async (value) => {
            if (!value.trim()) return setSuggestions([]); // 입력 값 없으면 비우기

            try {
                const res =
                    searchType === "school"
                        ? await searchSchoolsByName(value)
                        : await searchRegionByName(value);

                setSuggestions(
                    res.data.data[searchType] === "school"
                        ? res.data.data.schools
                        : res.data.data.regions
                );
            } catch (error) {
                console.error("❌ 검색 실패: ", error);
                setSuggestions([]);
            }
        }, 300), // 300ms 대기
        [searchType]
    );

    useEffect(() => {
        debouncedSearch(inputValue);
        console.log("inputValue: ", inputValue);
    }, [inputValue, debouncedSearch]);

    // 핸들러 함수: 검색 버튼 클릭 시
    const handleSearch = async () => {
        if (searchType.type === "school") {
            if (!selectedSchool) return alert("학교를 선택해주세요.");

            const { school_id } = selectedSchool;

            try {
                const res = searchType.grade
                    ? await getSchoolScheduleByGrade(
                          school_id,
                          searchType.grade
                      )
                    : await getSchoolSchedule(school_id);

                console.log("✅ 학교 학사일정: ", res.data);
            } catch (err) {
                console.error("❌ 학교 학사일정 조회 실패", err);
            }
        } else if (searchType.type === "region") {
            if (!selectedRegion) return alert("지역을 선택해주세요.");

            const { region_id } = selectedRegion;

            // 여기에 맞는 지역 관련 API가 필요
            console.log("📍 선택된 지역 ID: ", region_id);

            // 예: 지역 내 학교 리스트 가져오기 등
            // const res = await getRegionSchoolList(region_id);
        }
    };

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.searchRadioButtons}>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="school"
                        checked={searchType.type === "school"}
                        onChange={() =>
                            setSearchType((prev) => {
                                return { ...prev, type: "school" };
                            })
                        }
                    />
                    학교별
                </label>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="region"
                        checked={searchType.type === "region"}
                        onChange={() =>
                            setSearchType((prev) => {
                                return { ...prev, type: "region" };
                            })
                        }
                    />
                    지역별
                </label>
            </div>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className={styles.input}
                />
                {suggestions.length > 0 && (
                    <ul className={styles.suggestionsList}>
                        {suggestions.map((item, index) => (
                            // 검색어 자동완성이 아래에 리스트로 뜨도록 함
                            <li
                                key={index}
                                className={styles.suggestionItem}
                                onClick={() => {
                                    const isSchool =
                                        searchType.type === "school";
                                    const name = isSchool
                                        ? item.school_name
                                        : item.region_name;

                                    setInputValue(name); // 입력창에 이름 보여주기

                                    if (isSchool) {
                                        setSelectedSchool(item);
                                        setSelectedRegion(null); // 이전 지역 선택 초기화
                                    } else {
                                        setSelectedRegion(item);
                                        setSelectedSchool(null); // 이전 학교 선택 초기화
                                    }

                                    setSuggestions([]);
                                }}>
                                {searchType.type === "school"
                                    ? item.school_name
                                    : item.region_name}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    type="submit"
                    className={styles.button}
                    onClick={handleSearch}>
                    검색하기
                </button>
            </div>
        </div>
    );
};

export default SchoolSearchBar;
