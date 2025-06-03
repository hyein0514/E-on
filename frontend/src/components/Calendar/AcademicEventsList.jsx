// import styles from "../../styles/Calendar/AcademicEventsList.module.css";
// import { CurrentDateContext } from "../../contexts/CurrentDateContext";
// import { useContext } from "react";

// const sampleEvents = [
//     { day: 1, title: "입학식" },
//     { day: 2, title: "오리엔테이션" },
//     { day: 5, title: "수강신청 마감" },
//     { day: 8, title: "개강" },
// ];

// const AcademicEventsList = () => {
//     const { currentDate } = useContext(CurrentDateContext);

//     return (
//         <div className={styles.academicEventsList}>
//             <div className={styles.title}>
//                 {currentDate.year()}년 {currentDate.month() + 1}월 주요 학사
//                 일정
//             </div>
//             <div className={styles.eventRows}>
//                 {sampleEvents.map((event, idx) => (
//                     <div className={styles.eventRow} key={idx}>
//                         <div className={styles.day}>{event.day}일</div>
//                         <div className={styles.verticalLine}></div>
//                         <div className={styles.content}>{event.title}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AcademicEventsList;

import styles from "../../styles/Calendar/AcademicEventsList.module.css";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import { ViewContext } from "../../contexts/ViewContext";
import { useContext, useMemo } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween); // isBetween 플러그인 확장

const AcademicEventsList = () => {
    const { currentDate } = useContext(CurrentDateContext);
    const { searchType } = useContext(SearchTypeContext);
    const { schedules } = useContext(ViewContext);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");

    const filteredEvents = useMemo(() => {
        if (!schedules) return [];

        return schedules
            .filter((event) => {
                const dateStr =
                    searchType.type === "region"
                        ? event.average_date
                        : event.AA_YMD;

                const eventDate =
                    searchType.type === "region"
                        ? dayjs(dateStr, "YYYY-MM-DD")
                        : dayjs(dateStr, "YYYYMMDD");

                const isInMonth = eventDate.isBetween(
                    startOfMonth,
                    endOfMonth,
                    "day",
                    "[]"
                );

                const isCorrectSchoolType =
                    searchType.type === "region"
                        ? event.school_type === searchType.schoolType
                        : true;

                return isInMonth && isCorrectSchoolType;
            })
            .sort((a, b) => {
                const aDate =
                    searchType.type === "region"
                        ? dayjs(a.average_date)
                        : dayjs(a.AA_YMD, "YYYYMMDD");
                const bDate =
                    searchType.type === "region"
                        ? dayjs(b.average_date)
                        : dayjs(b.AA_YMD, "YYYYMMDD");

                return aDate.unix() - bDate.unix();
            });
    }, [schedules, searchType, currentDate]);

    return (
        <div className={styles.academicEventsList}>
            <div className={styles.title}>
                {currentDate.year()}년 {currentDate.month() + 1}월 주요 학사
                일정
            </div>
            <div className={styles.eventRows}>
                {filteredEvents.length === 0 ? (
                    <div className={styles.eventRow}>
                        이 달의 일정이 없습니다.
                    </div>
                ) : (
                    filteredEvents.map((event, idx) => {
                        const dateStr =
                            searchType.type === "region"
                                ? event.average_date
                                : event.AA_YMD;

                        const eventDate =
                            searchType.type === "region"
                                ? dayjs(dateStr, "YYYY-MM-DD")
                                : dayjs(dateStr, "YYYYMMDD");

                        return (
                            <div className={styles.eventRow} key={idx}>
                                <div className={styles.day}>
                                    {eventDate.date()}일
                                </div>
                                <div className={styles.verticalLine}></div>
                                <div className={styles.content}>
                                    {event.event_name || event.EVENT_NM}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AcademicEventsList;
