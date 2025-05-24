// Header.jsx

import styles from "./../../styles/Common/Header.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoLink}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
            </div>
        </header>
    );
};

export default Header;
