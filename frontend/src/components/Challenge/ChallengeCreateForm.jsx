import { useState } from "react";
import styles from "../../styles/Challenge/ChallengeCreateForm.module.css"


const ChallengeCreateForm = () => {
  // 여러 상태를 여기서 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 신청자 고정 (일반 사용자)
  const [field, setField] = useState("교과");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limit, setLimit] = useState("");
  const [minAge, setMinAge] = useState(8);
  const [maxAge, setMaxAge] = useState(16);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isRegular, setIsRegular] = useState("정기");
  const [repeatCycle, setRepeatCycle] = useState("주 1회");
  const [allowJoinMid, setAllowJoinMid] = useState("허용");
  const [days, setDays] = useState([]);
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);

  // 키워드 추가 (엔터나 추가 버튼)
  const addKeyword = () => {
    if (keywordInput && !keywords.includes(keywordInput)) {
      setKeywords([...keywords, keywordInput]);
      setKeywordInput("");
    }
  };
  const removeKeyword = (kw) => setKeywords(keywords.filter(k => k !== kw));

  // 요일 리스트
  const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

  // form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // 폼 데이터 전송 로직
    alert("등록 완료!");
  };

  return (
   <form
  className={styles.formContainer}
  onSubmit={handleSubmit}
>
  <div className={styles.flexRow}>
    {/* 좌측 컬럼 */}
    <div className={styles.column}>
      {/* 제목 */}
      <div className={styles.field}>
        <label className={styles.label}>제목</label>
        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      {/* 내용 */}
      <div className={styles.field}>
        <label className={styles.label}>내용</label>
        <textarea className={styles.input} style={{ minHeight: 90, resize: "vertical" }}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      {/* 신청자 */}
      <div className={styles.field} style={{ marginBottom: 28 }}>
        <label className={styles.label}>신청자</label>
        <input className={styles.input} value="일반 사용자" readOnly />
      </div>
      {/* 활동 분야 (라디오) */}
      <div className={styles.field}>
        <label className={styles.label}>활동 분야</label>
        <div style={{ display: "flex", gap: 18 }}>
          {["교과", "비교과", "진로"].map(f => (
            <label key={f} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <input
                type="radio"
                name="field"
                value={f}
                checked={field === f}
                onChange={() => setField(f)}
                style={{ accentColor: "#2563eb" }}
              />
              {f}
            </label>
          ))}
        </div>
        {/* 키워드 */}
        <div style={{ marginTop: 30 }}>
          <label className={styles.label} style={{ marginBottom: "3px" }}>하위분류(키워드, 엔터로 추가):</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className={styles.input}
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={e => (e.key === "Enter" ? (addKeyword(), e.preventDefault()) : null)}
              placeholder="키워드를 입력하고 엔터"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="button" onClick={addKeyword} className={styles.toggle}>추가</button>
          </div>
          <div style={{ marginTop: 7, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {keywords.map(kw => (
              <span
                key={kw}
                style={{
                  background: "#e5e7eb",
                  color: "#333",
                  borderRadius: 6,
                  padding: "5px 11px",
                  fontSize: "14px",
                  marginRight: "5px",
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                {kw}
                <button
                  type="button"
                  style={{
                    marginLeft: 5,
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer"
                  }}
                  onClick={() => removeKeyword(kw)}
                >×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* 모집 인원 */}
      <div className={styles.field}>
        <label className={styles.label}>모집 인원</label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 4, marginRight: 10 }}>
          <input
            type="radio"
            name="limitEnabled"
            checked={!limitEnabled}
            onChange={() => setLimitEnabled(false)}
            style={{ accentColor: "#2563eb" }}
          />
          무제한
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <input
            type="radio"
            name="limitEnabled"
            checked={limitEnabled}
            onChange={() => setLimitEnabled(true)}
            style={{ accentColor: "#2563eb" }}
          />
          제한
        </label>
        {limitEnabled && (
          <input
            type="number"
            min={1}
            className={styles.input}
            style={{ width: 90, display: "inline-block", marginLeft: 8 }}
            value={limit}
            onChange={e => setLimit(e.target.value.replace(/\D/, ""))}
            placeholder="모집 인원"
          />
        )}
      </div>
      {/* 연령 (최소/최대 가로, compact) */}
      <div className={styles.field}>
        <label className={styles.label}>연령</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>최소</span>
            <select
              value={minAge}
              onChange={e => setMinAge(Number(e.target.value))}
              className={styles.ageInput}
            >
              {Array.from({ length: 9 }, (_, i) => 8 + i).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 16, fontWeight: 400, margin: "0 5px" }}>~</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>최대</span>
            <select
              value={maxAge}
              onChange={e => setMaxAge(Number(e.target.value))}
              className={styles.ageInput}
            >
              {Array.from({ length: 9 }, (_, i) => 8 + i).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>

    {/* 우측 컬럼 */}
    <div className={styles.column}>
      {/* 활동 일정 */}
      <div className={styles.field}>
        <label className={styles.label}>활동 일정</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className={styles.input}
          style={{ width: 160, display: "inline-block" }}
        />{" ~ "}
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className={styles.input}
          style={{ width: 160, display: "inline-block" }}
        />
      </div>
      {/* 신청 마감일 */}
      <div className={styles.field}>
        <label className={styles.label}>신청 마감일</label>
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className={styles.input}
          style={{ width: 160 }}
        />
      </div>
      {/* 정기 여부 (라디오) */}
      <div className={styles.field}>
        <label className={styles.label}>정기 여부</label>
        <div style={{ display: "flex", gap: 16 }}>
          {["정기", "비정기"].map(type => (
            <label key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="radio"
                name="isRegular"
                value={type}
                checked={isRegular === type}
                onChange={() => setIsRegular(type)}
                style={{ accentColor: "#2563eb" }}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      {/* 반복 주기 (라디오) */}
      {isRegular === "정기" && (
        <div className={styles.field}>
          <label className={styles.label}>반복 주기</label>
          <div style={{ display: "flex", gap: 14 }}>
            {["주 1회", "격주", "월 1회", "정기 아님"].map(opt => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="radio"
                  name="repeatCycle"
                  value={opt}
                  checked={repeatCycle === opt}
                  onChange={() => setRepeatCycle(opt)}
                  style={{ accentColor: "#2563eb" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
      {/* 중도 참여 (라디오) */}
      <div className={styles.field}>
        <label className={styles.label}>중도 참여</label>
        <div style={{ display: "flex", gap: 16 }}>
          {["허용", "비허용"].map(opt => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="radio"
                name="allowJoinMid"
                value={opt}
                checked={allowJoinMid === opt}
                onChange={() => setAllowJoinMid(opt)}
                style={{ accentColor: "#2563eb" }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      {/* 요일 (체크박스) */}
      <div className={styles.field}>
        <label className={styles.label}>요일</label>
        <div style={{ display: "flex", gap: 10 }}>
          {dayOptions.map(d => (
            <label key={d} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <input
                type="checkbox"
                checked={days.includes(d)}
                onChange={() =>
                  setDays(days.includes(d)
                    ? days.filter(x => x !== d)
                    : [...days, d]
                  )
                }
                style={{ accentColor: "#2563eb" }}
              />
              {d}
            </label>
          ))}
        </div>
      </div>
      {/* 전화번호 */}
      <div className={styles.field}>
        <label className={styles.label}>개설자 전화번호</label>
        <input
          className={styles.input}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
          placeholder="010-1234-5678"
        />
      </div>
      {/* 첨부파일 */}
      <div className={styles.field}>
        <label className={styles.label}>첨부파일</label>
        <label className={styles.fileLabel}>
            파일선택
            <input
            type="file"
            style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])}
            />
        </label>
        {file && <div style={{ marginTop: 5, color: "#444" }}>{file.name}</div>}
        </div>

    </div>
  </div>
  <button type="submit" className={styles.button}>
    등록
  </button>
</form>

  );
};

export default ChallengeCreateForm;
