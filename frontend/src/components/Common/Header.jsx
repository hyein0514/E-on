// Header.jsx

import styles from "./../../styles/Common/Header.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoLink}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navContainer}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link to="/calendar" className={styles.navLink}>
                            학사 일정
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/challenge" className={styles.navLink}>
                            챌린지
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/community" className={styles.navLink}>
                            커뮤니티
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/myPage/:userId" className={styles.navLink}>
                            마이페이지
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
