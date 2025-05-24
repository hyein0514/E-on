import styles from "../../styles/Calendar/SchoolSearchBar.module.css";
import { useState, useEffect, useCallback } from "react";
import { searchSchoolsByName } from "../../api/schoolApi";
import { searchRegionByName } from "../../api/regionApi";
import debounce from "lodash.debounce";

const SchoolSearchBar = () => {
    const [searchType, setSearchType] = useState("school");
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const placeholder =
        searchType === "school"
            ? "학교 이름을 입력하세요"
            : "지역 이름을 입력하세요";

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

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.searchRadioButtons}>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="school"
                        checked={searchType === "school"}
                        onChange={() => setSearchType("school")}
                        defaultChecked
                    />
                    학교별
                </label>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="region"
                        checked={searchType === "region"}
                        onChange={() => setSearchType("region")}
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
                            <li key={index} className={styles.suggestionItem}>
                                {searchType === "school"
                                    ? item.school_name
                                    : item.region_name}
                            </li>
                        ))}
                    </ul>
                )}
                <button type="submit">검색하기</button>
            </div>
        </div>
    );
};

export default SchoolSearchBar;
