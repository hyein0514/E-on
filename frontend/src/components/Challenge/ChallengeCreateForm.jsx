import { useEffect, useState } from "react";
import styles from "../../styles/Challenge/ChallengeCreateForm.module.css";
import axios from "../../api/axiosInstance"; // ← 경로 맞게 조정!

const ChallengeCreateForm = ({
  mode = "create",
  initialData = {},
  onSubmit,
}) => {
  console.log("폼에 들어가는 initialData", initialData);
  const isEdit = mode === "edit";

  // 관심사/진로 옵션 전체 목록
  const [interestOptions, setInterestOptions] = useState([]);
  const [visionOptions, setVisionOptions] = useState([]);
  // 선택된 id 배열
  const [interestIds, setInterestIds] = useState(initialData.interestIds || []);
  const [visionIds, setVisionIds] = useState(initialData.visionIds || []);

  // 기존 form state
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [maximumPeople, setMaximumPeople] = useState(
    initialData.maximum_people || 1
  );
  const [minAge, setMinAge] = useState(initialData.minAge || 8);
  const [maxAge, setMaxAge] = useState(initialData.maxAge || 16);
  const [startDate, setStartDate] = useState(initialData.startDate || "");
  const [endDate, setEndDate] = useState(initialData.endDate || "");
  const [deadline, setDeadline] = useState(initialData.deadline || "");
  const [isRegular, setIsRegular] = useState(initialData.isRegular || "정기");
  const [repeatCycle, setRepeatCycle] = useState(
    initialData.repeatCycle || "주 1회"
  );
  const [allowJoinMid, setAllowJoinMid] = useState(
    initialData.allowJoinMid || "허용"
  );
  const [days, setDays] = useState(initialData.days || []);
  const [phone, setPhone] = useState(initialData.phone || "");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(initialData.status || "모집중");
  const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

  // 관심사/진로 목록 fetch (최초 마운트시에만)
  useEffect(() => {
    axios.get("/interests").then((res) => setInterestOptions(res.data));
    axios.get("/visions").then((res) => setVisionOptions(res.data));
  }, []);

  useEffect(() => {
  console.log("폼에 들어가는 initialData", initialData); // 이거 추가!
  if (isEdit && initialData && Object.keys(initialData).length > 0) {
    setTitle(initialData.title || "");
    setContent(initialData.content || initialData.description || "");
    setMaximumPeople(initialData.maximum_people || 1);
    setMinAge(initialData.minAge || initialData.minimum_age || 8);
    setMaxAge(initialData.maxAge || initialData.maximum_age || 16);
    setStartDate(initialData.startDate || initialData.duration?.start?.slice(0,10) || "");
    setEndDate(initialData.endDate || initialData.duration?.end?.slice(0,10) || "");
    setDeadline(initialData.deadline || initialData.application_deadline?.slice(0,10) || "");
    setIsRegular(
      initialData.isRegular !== undefined
        ? initialData.isRegular
        : (initialData.is_recuming ? "정기" : "비정기")
    );
    setRepeatCycle(
      initialData.repeatCycle ||
      (initialData.repeat_type === "WEEKLY"
        ? "주 1회"
        : initialData.repeat_type === "BIWEEKLY"
        ? "격주"
        : initialData.repeat_type === "MONTHLY"
        ? "월 1회"
        : "정기 아님")
    );
    setAllowJoinMid(
      initialData.allowJoinMid !== undefined
        ? initialData.allowJoinMid
        : (initialData.intermediate_participation ? "허용" : "비허용")
    );
    setDays(
      initialData.days
        ? initialData.days.map((d) => {
            const map = {
              Monday: "월", Tuesday: "화", Wednesday: "수",
              Thursday: "목", Friday: "금", Saturday: "토", Sunday: "일"
            };
            return map[d] || d;
          })
        : []
    );
    setPhone(initialData.phone || initialData.creator_contact || "");
    setStatus(initialData.status ||
      (initialData.challenge_state === "ACTIVE"
        ? "모집중"
        : initialData.challenge_state === "CLOSED"
        ? "마감"
        : initialData.challenge_state === "CANCELLED"
        ? "취소됨"
        : "")
    );
    setInterestIds(
      initialData.interestIds ||
      (initialData.interests ? initialData.interests.map(i => i.interest_id || i.id) : [])
    );
    setVisionIds(
      initialData.visionIds ||
      (initialData.visions ? initialData.visions.map(v => v.vision_id || v.id) : [])
    );
  }
}, [initialData, isEdit]);



  // 다중 체크 토글
  const toggleInterest = (id) => {
    setInterestIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };
  const toggleVision = (id) => {
    setVisionIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      content,
      maximum_people: Number(maximumPeople),
      minAge,
      maxAge,
      startDate,
      endDate,
      deadline,
      isRegular,
      repeatCycle: isRegular === "정기" ? repeatCycle : "정기 아님",
      allowJoinMid,
      days,
      phone,
      status: isEdit ? status : "모집중",
      interestIds,
      visionIds,
    };
    if (onSubmit) {
      onSubmit(formData, file);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.flexRow}>
        {/* 좌측 컬럼 */}
        <div className={styles.column}>
          {/* 제목 */}
          <div className={styles.field}>
            <label className={styles.label}>제목</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* 내용 */}
          <div className={styles.field}>
            <label className={styles.label}>내용</label>
            <textarea
              className={styles.input}
              style={{ minHeight: 90, resize: "vertical" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          {/* 관심사(복수 선택) */}
          <div className={styles.field}>
            <label className={styles.label}>관심사 선택 (복수 가능)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {interestOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: interestIds.includes(opt.id)
                      ? "#c7d2fe"
                      : "#f1f5f9",
                    fontWeight: interestIds.includes(opt.id) ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={interestIds.includes(opt.id)}
                    onChange={() => toggleInterest(opt.id)}
                  />
                  {opt.name}
                </label>
              ))}
            </div>
          </div>
          {/* 진로(비전) 복수 선택 */}
          <div className={styles.field} style={{ marginTop: 18 }}>
            <label className={styles.label}>진로(비전) 선택 (복수 가능)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {visionOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: visionIds.includes(opt.id)
                      ? "#fcd34d"
                      : "#f1f5f9",
                    fontWeight: visionIds.includes(opt.id) ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visionIds.includes(opt.id)}
                    onChange={() => toggleVision(opt.id)}
                  />
                  {opt.name}
                </label>
              ))}
            </div>
          </div>
          {/* 모집 인원 */}
          <div className={styles.field}>
            <label className={styles.label}>모집 인원</label>
            <input
              type="number"
              min={1}
              className={styles.input}
              style={{ width: 120 }}
              value={maximumPeople}
              onChange={(e) =>
                setMaximumPeople(e.target.value.replace(/\D/, ""))
              }
              placeholder="모집 인원(최소 1)"
              required
            />
          </div>
          {/* 연령 */}
          <div className={styles.field}>
            <label className={styles.label}>연령</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>최소</span>
                <select
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className={styles.ageInput}
                >
                  {Array.from({ length: 9 }, (_, i) => 8 + i).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <span style={{ fontSize: 16, fontWeight: 400, margin: "0 5px" }}>
                ~
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>최대</span>
                <select
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className={styles.ageInput}
                >
                  {Array.from({ length: 9 }, (_, i) => 8 + i).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* --------- ★ 상태(수정일 때만) --------- */}
          {isEdit && (
            <div className={styles.field}>
              <label className={styles.label}>상태</label>
              <div style={{ display: "flex", gap: 16 }}>
                {["모집중", "마감"].map((s) => (
                  <label
                    key={s}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      style={{ accentColor: "#2563eb" }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우측 컬럼 */}
        <div className={styles.column}>
          {/* 활동 일정 */}
          <div className={styles.field}>
            <label className={styles.label}>활동 일정</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
              style={{ width: 160, display: "inline-block" }}
            />{" "}
            ~{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
              onChange={(e) => setDeadline(e.target.value)}
              className={styles.input}
              style={{ width: 160 }}
            />
          </div>
          {/* 정기 여부 */}
          <div className={styles.field}>
            <label className={styles.label}>정기 여부</label>
            <div style={{ display: "flex", gap: 16 }}>
              {["정기", "비정기"].map((type) => (
                <label
                  key={type}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
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
          {/* 반복 주기 */}
          {isRegular === "정기" && (
            <div className={styles.field}>
              <label className={styles.label}>반복 주기</label>
              <div style={{ display: "flex", gap: 14 }}>
                {["주 1회", "격주", "월 1회", "정기 아님"].map((opt) => (
                  <label
                    key={opt}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
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
          {/* 중도 참여 */}
          <div className={styles.field}>
            <label className={styles.label}>중도 참여</label>
            <div style={{ display: "flex", gap: 16 }}>
              {["허용", "비허용"].map((opt) => (
                <label
                  key={opt}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
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
          {/* 요일 */}
          <div className={styles.field}>
            <label className={styles.label}>요일</label>
            <div style={{ display: "flex", gap: 10 }}>
              {dayOptions.map((d) => (
                <label
                  key={d}
                  style={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  <input
                    type="checkbox"
                    checked={days.includes(d)}
                    onChange={() =>
                      setDays(
                        days.includes(d)
                          ? days.filter((x) => x !== d)
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
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9-]/g, ""))
              }
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
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {file && (
              <div style={{ marginTop: 5, color: "#444" }}>{file.name}</div>
            )}
          </div>
        </div>
      </div>
      <button type="submit" className={styles.button}>
        {isEdit ? "수정" : "등록"}
      </button>
    </form>
  );
};

export default ChallengeCreateForm;
