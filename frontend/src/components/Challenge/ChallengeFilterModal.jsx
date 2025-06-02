import { useState } from "react";

const initialFilterState = {
  status: [],        // ['진행중', '완료']
  activityTypes: [], // ['교과', '비교과', '진로']
  date: "", // YYYY-MM-DD
  minAge: "",
  maxAge: "",
};

const statusList = ['진행중', '완료'];
const activityTypeList = ['교과', '비교과', '진로'];

const ChallengeFilterModal = ({ onClose, onApply }) => {
  const [filters, setFilters] = useState(initialFilterState);

  // 체크박스 관리 함수
  const toggleArrayValue = (arr, value) =>
    arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: "14px", padding: "32px 26px", minWidth: "340px", boxShadow: "0 3px 12px rgba(0,0,0,0.13)"
      }}>
        <h2 style={{ marginBottom: "16px", fontWeight: "bold", fontSize: "18px" }}>필터 조건</h2>
        {/* 1. 상태 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>상태</span>
          <div style={{ display: "flex", gap: "12px", marginTop: "7px" }}>
            {statusList.map((status) => (
              <label key={status} style={{ fontWeight: "400" }}>
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() =>
                    setFilters(f => ({
                      ...f,
                      status: toggleArrayValue(f.status, status)
                    }))
                  }
                />{" "}
                {status}
              </label>
            ))}
          </div>
        </div>
        {/* 2. 활동타입 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>활동타입</span>
          <div style={{ display: "flex", gap: "12px", marginTop: "7px" }}>
            {activityTypeList.map((type) => (
              <label key={type} style={{ fontWeight: "400" }}>
                <input
                  type="checkbox"
                  checked={filters.activityTypes.includes(type)}
                  onChange={() =>
                    setFilters(f => ({
                      ...f,
                      activityTypes: toggleArrayValue(f.activityTypes, type)
                    }))
                  }
                />{" "}
                {type}
              </label>
            ))}
          </div>
        </div>
        {/* 3. 날짜 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>날짜</span>
          <div style={{ marginTop: "7px" }}>
            <input
              type="date"
              value={filters.date}
              onChange={e =>
                setFilters(f => ({ ...f, date: e.target.value }))
              }
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #e0e7ef" }}
            />
          </div>
        </div>

        {/* 4. 최소나이 / 최대나이 */}
        <div style={{ marginBottom: "22px" }}>
          <span style={{ fontWeight: "500" }}>나이</span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "7px" }}>
            <input
              type="number"
              placeholder="최소"
              min={0}
              value={filters.minAge}
              onChange={e => setFilters(f => ({ ...f, minAge: e.target.value }))}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e0e7ef", width: "72px" }}
            />
            ~
            <input
              type="number"
              placeholder="최대"
              min={0}
              value={filters.maxAge}
              onChange={e => setFilters(f => ({ ...f, maxAge: e.target.value }))}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e0e7ef", width: "72px" }}
            />
          </div>
        </div>
        {/* 확인/취소 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 18px", borderRadius: "7px", border: "none",
              background: "#e5e7eb", color: "#6b7280", fontWeight: "bold", fontSize: "15px"
            }}
          >취소</button>
          <button
            onClick={() => onApply(filters)}
            style={{
              padding: "7px 18px", borderRadius: "7px", border: "none",
              background: "#2563eb", color: "#fff", fontWeight: "bold", fontSize: "15px"
            }}
          >적용</button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFilterModal;
