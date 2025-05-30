import styles from "../../styles/Calendar/EventBadge.module.css";

const EventBadge = ({ event_name }) => {
    return <div className={styles.eventBadge}>{event_name}</div>;
};