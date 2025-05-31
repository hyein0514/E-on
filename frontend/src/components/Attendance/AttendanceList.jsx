import { useState } from "react";
import AttendanceItem from "./AttendanceItem";

const AttendanceList = ({ students }) => {
  const [attendance, setAttendance] = useState(
    students.map(s => ({
      id: s.id,
      name: s.name,
      status: "",
      reason: ""
    }))
  );
  const [saved, setSaved] = useState(false);

  const updateStatus = (id, status) => {
    setAttendance(list =>
      list.map(item =>
        item.id === id
          ? item.status === status
            ? { ...item, status: "", reason: "" }
            : { ...item, status, reason: status === "결석" ? item.reason : "" }
          : item
      )
    );
  };

  const updateReason = (id, reason) => {
    setAttendance(list =>
      list.map(item =>
        item.id === id ? { ...item, reason } : item
      )
    );
  };

  const handleDelete = (id) => {
    setAttendance(list =>
      list.map(item =>
        item.id === id ? { ...item, status: "", reason: "" } : item
      )
    );
  };

  const handleSave = () => {
  setSaved(true);
  setTimeout(() => {
    alert(JSON.stringify(attendance, null, 2));
    setTimeout(() => setSaved(false), 1500);
  }, 0);
};

  return (
    <div>
      {attendance.map((item, idx) => (
        <AttendanceItem
          key={item.id}
          num={idx + 1}
          name={item.name}
          status={item.status}
          reason={item.reason}
          onStatus={status => updateStatus(item.id, status)}
          onReason={reason => updateReason(item.id, reason)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
      <button
        style={{
          display: "block",
          width: "160px",
          margin: "36px auto 0",
          padding: "13px 0",
          background: saved ? "#38bdf8" : "#d4d4d4",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "17px",
          cursor: "pointer"
        }}
        onClick={handleSave}
      >저장</button>
    </div>
  );
};

export default AttendanceList;
