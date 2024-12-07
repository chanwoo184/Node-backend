# Job-board REST API

채용 공고, 북마크, 사용자 지원 등 다양한 기능을 관리하는 종합적인 RESTful API입니다. 이 API는 잡보드 플랫폼의 견고한 백엔드를 제공하여 채용 공고 목록 관리, 사용자 상호작용, 관리자 기능 등을 지원합니다.

## 목차

- [특징](#특징)
- [사용 기술](#사용-기술)
- [시작하기](#시작하기)
  - [필수 조건](#필수-조건)
  - [설치](#설치)
  - [환경 변수 설정](#환경-변수-설정)
- [애플리케이션 실행](#애플리케이션-실행)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)
- [테스트](#테스트)
- [배포](#배포)
- [기여하기](#기여하기)
- [라이선스](#라이선스)

## 특징

### 채용 공고 관리
- **채용 공고 생성:** 관리자만 새로운 채용 공고를 생성할 수 있습니다.
- **채용 공고 조회:** 페이지네이션, 다양한 필터링 및 정렬 옵션을 통해 채용 공고를 조회할 수 있습니다.
- **채용 공고 상세 정보:** 특정 채용 공고의 상세 정보(회사 정보, 요구 기술 등)를 조회할 수 있습니다.
- **채용 공고 수정:** 관리자가 기존 채용 공고를 수정할 수 있습니다.
- **채용 공고 삭제:** 관리자가 채용 공고를 삭제할 수 있습니다.
- **검색 및 필터링:** 키워드, 위치, 경력, 기술 스택 등 다양한 기준으로 채용 공고를 검색하고 필터링할 수 있습니다.
- **데이터 집계:** 산업별 채용 공고 수 및 산업별 평균 연봉과 같은 통계 데이터를 생성할 수 있습니다.

### 사용자 상호작용
- **채용 공고 북마크:** 사용자가 채용 공고를 북마크하거나 북마크를 해제할 수 있습니다.
- **북마크 목록 조회:** 북마크한 채용 공고 목록을 페이지네이션, 정렬, 필터링을 통해 조회할 수 있습니다.
- **사용자 인증:** JWT 기반의 안전한 사용자 등록 및 로그인 기능을 제공합니다.
- **역할 기반 접근 제어:** 사용자 역할(예: 관리자, 일반 사용자)에 따라 기능 접근 권한을 다르게 설정합니다.

### 추가 기능
- **채용 공고 크롤링:** Saramin과 같은 외부 소스에서 채용 공고를 자동으로 크롤링하고 저장하는 스케줄 작업을 포함합니다.
- **메트릭스 및 모니터링:** Prometheus를 활용한 실시간 메트릭스를 통해 API 성능을 모니터링합니다.
- **에러 처리:** 글로벌 에러 핸들러를 통해 일관된 에러 응답을 제공합니다.
- **로깅:** 요청 및 에러 로깅을 통해 디버깅 및 모니터링을 용이하게 합니다.

## 사용 기술

- **런타임 환경:** Node.js
- **프레임워크:** Express.js
- **데이터베이스:** MongoDB (Mongoose ODM 사용)
- **인증:** JWT (JSON Web Tokens)
- **유효성 검사:** Joi
- **문서화:** Swagger (OpenAPI)
- **테스트:** Jest, Supertest
- **로깅:** Winston, Morgan
- **모니터링:** Prometheus, Grafana
- **기타 도구:** Nodemon, Helmet, CORS, Rate Limiting, Cron Jobs

## 시작하기

### 필수 조건

- **Node.js:** Node.js가 설치되어 있어야 합니다 (권장 버전: v14 이상).
- **MongoDB:** 실행 중인 MongoDB 인스턴스가 필요합니다. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)를 사용하거나 로컬에 MongoDB를 설치할 수 있습니다.
- **Git:** 버전 관리를 위해 Git이 설치되어 있어야 합니다.

## 설치

**저장소 클론하기:**

   ```
   bash
   git clone https://github.com/yourusername/job-board-api.git
   cd job-board-api
   ```

## 애플리케이션 실행 

### 개발 모드

코드 변경 시 자동으로 서버를 재시작하는 nodemon을 사용합니다.
```
npm run dev
```

### 프로덕션 모드

nodemon 없이 서버를 실행합니다.
```
npm run start
```

## API 문서

포괄적인 API 문서는 Swagger UI를 통해 확인할 수 있습니다.

### Swagger UI 접근
```
http://localhost:5000/api/docs
```

## 프로젝트 구조
```
project/
├── controllers/
│   ├── applicationController.js
│   ├── bookmarkController.js
│   ├── jobController.js
│   ├── userController.js
│   └── ... 기타 컨트롤러
├── models/
│   ├── Application.js
│   ├── Bookmark.js
│   ├── Company.js
│   ├── Job.js
│   ├── Category.js
│   ├── Skill.js
│   ├── User.js
│   └── ... 기타 모델
├── routes/
│   ├── applicationRoutes.js
│   ├── bookmarkRoutes.js
│   ├── jobRoutes.js
│   ├── userRoutes.js
│   ├── authRoutes.js
│   └── ... 기타 라우터
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── paginationMiddleware.js
│   ├── rateLimitMiddleware.js
│   ├── loggerMiddleware.js
│   └── ... 기타 미들웨어
├── utils/
│   ├── customError.js
│   ├── logger.js
│   ├── parseDate.js
│   ├── metrics.js
│   └── ... 기타 유틸리티
├── services/
│   ├── crawler.js
│   └── ... 기타 서비스
├── tests/
│   ├── job.test.js
│   └── ... 기타 테스트 파일
├── config/
│   ├── db.js
│   └── ... 기타 설정
├── index.js
├── package.json
├── .env
├── README.md
└── ... 기타 파일
```