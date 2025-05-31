import AttendanceList from "../../components/Attendance/AttendanceList";
import Header from "../../components/Common/Header";

const dummyStudents = [
  { id: 1, name: "김가나" },
  { id: 2, name: "김가나" },
  { id: 3, name: "김가나" },
  { id: 4, name: "김가나" }
];

const Attendance = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: 920,        // 가로 길이 늘림 (원래 600)
          margin: "40px auto",
          padding: 38,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 32, fontSize: 28 }}>출석</h2>
        {/* 인원추가 버튼 제거 */}
        <AttendanceList students={dummyStudents} />
      </div>
    </div>
  );
};

export default Attendance;
