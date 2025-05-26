import styles from "../../styles/Calendar/ViewNavigator.module.css";
import { useContext } from "react";
import { ViewContext } from "../../contexts/ViewContext";

const ViewNavigator = () => {
    const { currentView, setCurrentView } = useContext(ViewContext);
    const handleViewTypeChange = (event) => {
        setCurrentView(event.target.value);
    };

    return (
        <div className={styles.viewNavigator}>
            <div className={styles.left}>
                <div className={styles.name}>가가초등학교</div>
                <div className={styles.text}>학사일정</div>
                <div className={styles.selectGrade}>
                    <select className={styles.select}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                    <span className={styles.selectText}>학년</span>
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
