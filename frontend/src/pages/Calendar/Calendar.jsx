// Calendar/Calendar.jsx

import styles from "../../styles/Pages/Calendar.module.css";
import Header from "../../components/Common/Header";

const Calendar = () => {
    return (
        <div>
            <div className={styles.header}>
                <Header />
            </div>
            <h1>Calendar Page</h1>
        </div>
    );
}

export default Calendar;