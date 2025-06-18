import styles from "../../styles/MyPage/BoardRequest.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const BoardRequest = () => {
    // const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         try {
    //             const response = await fetch('/api/board-requests');
    //             if (!response.ok) throw new Error('Failed to fetch requests');
    //             const data = await response.json();
    //             setRequests(data);
    //         } catch (error) {
    //             console.error('Error fetching board requests:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (user && user.type === 'admin') {
    //         fetchRequests();
    //     }
    // }, [user]);

    // if (loading) return <p>로딩 중...</p>;
    // if (!user || user.type !== 'admin') return <p>권한이 없습니다.</p>;

    return (
        <div className={styles.container}>
            <h2>게시판 개설 요청</h2>
            {requests.length === 0 ? (
                <p>현재 요청이 없습니다.</p>
            ) : (
                <ul className={styles.requestList}>
                    {requests.map((request) => (
                        <li key={request.id} className={styles.requestItem}>
                            <h3>{request.title}</h3>
                            <p>{request.description}</p>
                            <p>요청자: {request.requester}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BoardRequest;
