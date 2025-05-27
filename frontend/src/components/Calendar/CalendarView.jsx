import styles from "../../styles/Calendar/CalendarView.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 locale 추가
import { useContext, useMemo } from "react";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import { ViewContext } from "../../contexts/ViewContext";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";

const CalendarView = () => {
    // 현재 날짜 상태 관리
    const { currentDate, setCurrentDate } = useContext(CurrentDateContext);
    const { currentView } = useContext(ViewContext);

    const now = useMemo(() => dayjs(), []); // 고정된 현재 시점

    const minDate = useMemo(() => {
        const month = currentDate.month();
        if (month === 0 || month === 1) {
            return now.subtract(2, "year").month(2).startOf("month");
        } else {
            return now.subtract(1, "year").month(2).startOf("month");
        }
    }, [currentDate, now]);

    const maxDate = useMemo(() => {
        const month = currentDate.month();
        if (month === 0 || month === 1) {
            return now.month(1).endOf("month");
        } else {
            return now.add(1, "year").month(2).endOf("month");
        }
    }, [currentDate, now]);

    /* 이전 달로 이동하는 메서드 */
    const prevMonth = () => {
        /* 이전 상태 값을 가져와서 변경시키도록 함 */
        if (currentDate.isAfter(minDate, "month")) {
            // 전년도 3월까지만 이동할 수 있게 함
            if (currentDate.month() === 0 || currentDate.month() === 1) {
                setCurrentDate((prevDate) =>
                    prevDate.subtract(1, "year").month(11)
                );
            } else setCurrentDate((prevDate) => prevDate.subtract(1, "month"));
        }
    };

    /* 다음 달로 이동하는 메서드 */
    const nextMonth = () => {
        if (currentDate.isBefore(maxDate, "month")) {
            setCurrentDate((prevDate) => prevDate.add(1, "month"));
        }
    };

    return (
        <div className={styles.calendarView}>
            <div className={styles.selectDate}>
                <div className={styles.prevMonth} onClick={prevMonth}>
                    {"<"}
                </div>
                <div className={styles.monthView}>
                    <div className={styles.month}>
                        {currentDate.month() + 1}
                    </div>
                    <div className={styles.monthText}>월</div>
                </div>
                <div className={styles.nextMonth} onClick={nextMonth}>
                    {">"}
                </div>
            </div>
            <div className={styles.calendar}>
                <div className={styles.weekdays}>
                    {[
                        "일요일",
                        "월요일",
                        "화요일",
                        "수요일",
                        "목요일",
                        "금요일",
                        "토요일",
                    ].map((day, index) => {
                        let className = styles.weekday;
                        if (index === 0) className += ` ${styles.sunday}`;
                        else if (index === 6)
                            className += ` ${styles.saturday}`;

                        return (
                            <div key={day} className={className}>
                                {day}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.calendarViewContent}>
                    {currentView == "monthly" ? (
                        <MonthlyView />
                    ) : (
                        <WeeklyView />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
