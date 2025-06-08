import styles from "../../styles/Calendar/SchoolSearchBar.module.css";
import search from "../../assets/search.svg";
import { useState, useEffect, useCallback, useContext } from "react";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import { ViewContext } from "../../contexts/ViewContext";
import {
    searchRegionByName,
    searchAverageScheduleByName,
    searchAverageScheduleByGrade,
} from "../../api/regionApi";
import {
    searchSchoolsByName,
    // getSchoolSchedule,
    // getSchoolScheduleByGrade,
    // getPrevSchoolScheduleByGrade,
    getAllSchoolSchedule,
} from "../../api/schoolApi";
// import extractCityName from "../../utils/extractCityNameUtil"
import debounce from "lodash.debounce";

const SchoolSearchBar = () => {
    const { searchType, setSearchType, setSchoolAdress } =
        useContext(SearchTypeContext);
    const { setSelectedValue, setSchedules } = useContext(ViewContext);
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const placeholder =
        searchType.type === "school"
            ? "학교 이름을 정확히 입력하세요"
            : "지역 이름을 정확히 입력하세요";

    const debouncedSearch = useCallback(
        debounce(async (value) => {
            if (!value.trim()) return setSuggestions([]); // 입력 값 없으면 비우기

            try {
                const res =
                    searchType.type === "school"
                        ? await searchSchoolsByName(value)
                        : await searchRegionByName(value);

                // console.log("res: ", res.data);

                setSuggestions(
                    searchType.type === "school"
                        ? res.data
                        : res.data.data.regions
                );

                // console.log("suggestions: ", suggestions);
            } catch (error) {
                console.error("❌ 검색 실패: ", error);
                setSuggestions([]);
            }
        }, 300), // 300ms 대기
        [searchType]
    );

    useEffect(() => {
        debouncedSearch(inputValue);
        // console.log("inputValue: ", inputValue);
    }, [inputValue, debouncedSearch]);

    // 핸들러 함수: 검색 버튼 클릭 시
    const handleSearch = async () => {
        if (searchType.type === "school") {
            if (!selectedSchool) return alert("학교를 선택해주세요.");

            const { schoolCode, name, address, schoolType, atptCode } = selectedSchool;

            setSchoolAdress(address);

            if (schoolType === "중학교") {
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

            try {
                const year = searchType.year === "prev" ? "prev" : undefined;
                const grade = searchType.grade || undefined;

                // 통합된 API 호출
                const res = await getAllSchoolSchedule(
                    schoolCode,
                    atptCode,
                    year,
                    grade
                );

                setSelectedValue(name);
                setSchedules(res.data);
                console.log("✅ 학교 학사일정: ", res.data);
            } catch (err) {
                console.error("❌ 학교 학사일정 조회 실패", err);
            }

        } else if (searchType.type === "region") {
            if (!selectedRegion) return alert("지역을 선택해주세요.");

            const { region_name } = selectedRegion;
            setSchoolAdress("");

            // console.log("📍 선택된 지역: ", region_name);

            try {
                const res = searchType.grade
                    ? await searchAverageScheduleByGrade(
                          region_name,
                          searchType.grade
                      )
                    : await searchAverageScheduleByName(region_name);

                setSelectedValue(region_name);
                setSchedules(res.data.data);
                console.log("✅ 평균 학사일정: ", res.data);
            } catch (err) {
                console.error("❌ 평균 학사일정 조회 실패", err);
            }
        }
    };
    //     if (searchType.type === "school") {
    //         if (!school) return alert("학교를 선택해주세요.");

    //         const { schoolCode, name, schoolType, atptCode } = school;

    //         const mappedSchoolType =
    //             schoolType === "중학교" ? "middle" : "elementary";
    //         setSearchType((prev) => ({
    //             ...prev,
    //             schoolType: mappedSchoolType,
    //         }));

    //         try {
    //             const year = searchType.year === "prev" ? "prev" : undefined;
    //             const grade = searchType.grade || undefined;

    //             const res = await getAllSchoolSchedule(
    //                 schoolCode,
    //                 atptCode,
    //                 year,
    //                 grade
    //             );

    //             setSelectedValue(name);
    //             setSchedules(res.data);
    //             console.log("✅ 학교 학사일정: ", res.data);
    //         } catch (err) {
    //             console.error("❌ 학교 학사일정 조회 실패", err);
    //         }
    //     } else if (searchType.type === "region") {
    //         if (!region) return alert("지역을 선택해주세요.");
    //         const { region_name } = region;

    //         try {
    //             const res = searchType.grade
    //                 ? await searchAverageScheduleByGrade(
    //                       region_name,
    //                       searchType.grade
    //                   )
    //                 : await searchAverageScheduleByName(region_name);

    //             setSelectedValue(region_name);
    //             setSchedules(res.data.data);
    //             console.log("✅ 평균 학사일정: ", res.data);
    //         } catch (err) {
    //             console.error("❌ 평균 학사일정 조회 실패", err);
    //         }
    //     }
    // };

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
                <img src={search} className={styles.search} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    className={styles.input}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)} // blur 시 잠깐 delay (클릭 허용)
                />
                {isFocused && suggestions.length > 0 && (
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
                                        ? item.name
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
                                    ? item.name
                                    : item.region_name}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleSearch}>
                    검색하기
                </button>
            </div>
        </div>
    );
};

export default SchoolSearchBar;
