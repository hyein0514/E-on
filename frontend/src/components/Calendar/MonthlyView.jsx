import styles from "../../styles/Calendar/CalendarView.module.css";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import { useContext } from "react";

const MonthlyView = () => {
    const { currentDate } = useContext(CurrentDateContext);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");

    const startDayOfWeek = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const days = [];

    // 지난 달의 날짜 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
        const date = startOfMonth.subtract(startDayOfWeek - i, "day");
        days.push({
            date,
            currentMonth: false,
        });
    }

    // 이번 달의 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: currentDate.date(i),
            currentMonth: true,
        });
    }

    // 다음 달의 날짜 채우기
    const totalCells = days.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: endOfMonth.add(i, "day"),
            currentMonth: false,
        });
    }

    return (
        <div className={styles.calendarView}>
            <div className={styles.days}>
                {days.map(({ date, currentMonth }, index) => (
                    <div
                        key={index}
                        className={`${styles.day} ${
                            currentMonth ? "" : styles.otherMonth
                        }`}
                    >
                        {date.date()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyView;
