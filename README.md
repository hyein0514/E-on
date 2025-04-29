# ✅  E-ON 프로젝트 README.md (팀원 전용, GCP + Docker 기준)

# E-ON 프로젝트

> GCP 서버에 배포되는 풀스택 교육 플랫폼입니다.  
> 백엔드(Node.js), 프론트엔드(React), 데이터베이스(MySQL)를 Docker로 통합 구성했습니다.


## 📁 프로젝트 폴더 구조

```
e-on/
├── backend/             # Node.js API 서버
│   └── index.js, db.js, ...
│   └── .env (직접 작성)
├── frontend/            # React 프론트엔드 앱
│   └── src/, public/
├── docker-compose.yml   # 전체 서비스 정의 파일
├── .gitignore
└── README.md
```

# 🧑‍💻 팀원이 개발 시작하는 방법

## ✅ 1. GitHub 프로젝트 clone

```bash
git clone https://github.com/Education-ON/e-on.git
cd e-on
```



## ✅ 2. Docker 설치 (필수)

- Windows/Mac: Docker Desktop 설치 → 실행
- Ubuntu: 터미널에서

```bash
sudo apt update
sudo apt install docker.io docker-compose
```

- 설치 후 `docker --version`, `docker-compose --version` 으로 정상 설치 확인
- 반드시 Docker를 켜놓은 상태에서 시작하세요

---

## ✅ 3. `.env` 파일 생성 (백엔드 폴더 안에)

`/backend/.env` 파일을 직접 만들어 아래처럼 작성합니다.

### 📍 로컬 개발용 (.env 내용)

```env
DB_HOST= 35.216.117.143    # (GCP 서버의 외부 IP 주소)
DB_PORT=3306
DB_USER=eon
DB_PASSWORD=eon
DB_NAME=eon_db
PORT=4000
```

> **주의:**  
> - `DB_HOST=localhost`나 `mysql` 쓰면 안 됩니다.  
> - 반드시 GCP 서버의 외부 IP를 적어야 합니다.

---

## ✅ 4. 프로젝트 실행 방법

### 📍 로컬에서 직접 실행할 때 (Docker 안 쓰고)

**백엔드 서버 실행**

```bash
cd backend
npm install
npm run dev
```

**프론트엔드 실행**

```bash
cd frontend
npm install
npm run dev
```

- 프론트엔드 접속: http://localhost:3000  
- 백엔드 API 접속: http://localhost:4000/api

---

## ✅ 5. Docker로 통합 실행할 때 (GCP 서버나 로컬에서 Docker 통합)

**Docker-compose로 전체 띄우기**

```bash
docker-compose up --build -d
```

> 이때는 `/backend/.env` 파일 안의 `DB_HOST`를 `mysql`로 설정해야 합니다.  
> (컨테이너끼리 내부 통신할 때는 이름으로 연결합니다.)

즉,

- GCP 서버 안에서는 `/backend/.env` → `DB_HOST=mysql`
- 로컬 개발자는 `/backend/.env` → `DB_HOST=GCP IP`

---

# 🌐 GCP 서버 구조

### 📍 GCP 서버 안에서 도커가 하는 일

```
[ backend 컨테이너 (Node.js) ]
    ↕ DB 연결 (mysql 이름 사용)
[ mysql 컨테이너 (MySQL) ]

[ frontend 컨테이너 (React) ]
```

- 모든 컨테이너는 `docker-compose.yml`로 관리
- 외부 포트 오픈: 3000(프론트), 4000(백엔드), 3306(DB)

---

# 🚨 주의사항 요약

| 항목 | 설명 |
|------|------|
| `.env` 설정 | 로컬은 GCP IP 사용, 서버는 mysql 사용 |
| Docker 필수 여부 | GCP 서버에서는 반드시 Docker 사용 |
| 방화벽 설정 | GCP 방화벽에서 3000, 4000, 3306 포트 오픈 필요 |
| DB 동시접속 | 여러 명이 GCP MySQL에 동시에 접속 가능 |

---

# ✅ 요약 흐름

| 작업 | 로컬 개발자 | GCP 서버 |
|------|-------------|----------|
| DB 연결 | GCP IP | mysql (컨테이너 이름) |
| 실행 방법 | npm run dev | docker-compose up |
| 필요한 파일 | backend/.env | backend/.env |

---

# 📚 기술 스택

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Docker Compose, GCP Compute Engine

---

# 🙋‍♂️ 협업 규칙

- `.env` 파일은 절대 GitHub에 올리지 않는다
- 코드 수정 후 PR 또는 Push 시 백엔드/프론트 각각 테스트
- 도커로 통합 빌드 후 최종 배포 테스트 필수

---

> 본 프로젝트는 Docker 기반 풀스택 환경 통합을 목표로 하며,  
> GCP 실서버 배포를 기준으로 운영됩니다.
```
