import styles from "../../styles/Calendar/EventBadge.module.css";

const EventBadge = ({ event_name }) => {
    return (
        <div className={styles.eventBadge}>
            <div className={styles.eventTitle}>{event_name}</div>
        </div>
    );
};

export default EventBadge;
