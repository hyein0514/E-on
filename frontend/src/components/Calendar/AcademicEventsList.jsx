import styles from "../../styles/Calendar/AcademicEventsList.module.css";
import { CurrentDateContext } from "../../contexts/CurrentDateContext"
import { useContext } from "react";

const AcademicEventsList = () => {
    const { currentDate } = useContext(CurrentDateContext);
    
    return (
        <div className={styles.academicEventsList}>
            <div className={styles.title}>
                <div className={styles.month}>{currentDate.month()+1}</div>
                <div className={styles.text}>월의 주요 학사일정</div>
            </div>
            <div className={styles.academicEvents}>
                
            </div>
        </div>
    );
};

export default AcademicEventsList;