# Job-board REST API

채용 공고, 북마크, 사용자 지원 등 다양한 기능을 관리하는 종합적인 RESTful API입니다.<br>
이 API는 잡보드 플랫폼의 견고한 백엔드를 제공하여 채용 공고 목록 관리, 사용자 상호작용, 관리자 기능 등을 지원합니다.

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

### 참고사항

- **Node.js:** Node.js가 설치되어 있어야 합니다 (권장 버전: v14 이상).
- **MongoDB:** 실행 중인 MongoDB 인스턴스가 필요합니다. 저는 MongoDB Compass를 이용해서 관리했습니다.
- **pm2:** 백그라운드에서 실행되도록 설정
- **회원 관리 API(/auth)의 회원 정보 수정(PUT/auth/profile)은 Users 엔드포인트의 (PUT/users/me)로 구현해놨습니다.**
- **자체 서명된 SSL 인증서를 사용하여 포트 443에서 HTTPS 서버를 설정했습니다.**
  ```
  // 다음 명령어를 사용하여 자체 서명된 SSL 인증서와 개인 키를 생성
  openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365

  //명령어 실행 후, 다음과 같은 정보를 입력하라는 프롬프트가 나타납니다.
  Country Name (2 letter code): 국가 코드 (예: KR)
  State or Province Name (full name): 주 또는 도 이름
  Locality Name (eg, city): 도시 이름
  Organization Name (eg, company): 조직 이름
  Organizational Unit Name (eg, section): 부서 이름
  Common Name (e.g. server FQDN or YOUR name): IP 주소 (예: 113.198.66.75)
  Email Address: 이메일 주소

  // 생성된 인증서 및 키 파일 확인
  ls -l server.*
  // SSL 인증서 및 키 로드(index.js에 존재)
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
  };
  ```
## 설치 및 사용 방법

### 설치
  **저장소 클론하기:**
   ```
   git clone https://github.com/chanwoo184/Node-backend.git
   ``` 
  **package.json을 다운 받았다면:**
   ```
   npm install 
   ```

### 사용 방법

  **개발:**
  코드 변경 시 자동으로 서버를 재시작하는 nodemon을 사용합니다.
  ```
  npm run dev
  ```
  **Jcloud 실행:**
  ```
  cd Node-backend
  pm2 start index.js --name Node-backend
  pm2 list // 실행된 프로세스 확인

  // MongoDB 서비스 시작 및 상태 확인
  sudo systemctl restart mongod
  sudo systemctl status mongod

  // MongoDB 사용자 생성
  mongosh mongodb://127.0.0.1:3000/saramin

  db.createUser({
  user: "chanwoo",
  pwd: "1234",
  roles: [ { role: "readWrite", db: "saramin" } ]
  })

  ```
  **크롤링 실행:**
  ```
  node scripts/crawl.js
  ```
## DB
- 3000 포트포워딩
- MongoDB Compass를 이용해서 관리
  - (mongodb://chanwoo:1234@113.198.66.75:13227/saramin)

## API 문서
- 443 포트포워딩
- 포괄적인 API 문서는 Swagger UI를 통해 확인할 수 있습니다.
  - 개발환경: [Link](http://localhost:3000/api-docs)
  - 배포환경: [Link](https://113.198.66.75:17227/api-docs/#/)

### **Applications**
**지원 및 관심 등록 관련 엔드포인트:**
```
POST /api/applications/apply/{jobId}         # 채용 공고에 지원합니다.
DELETE /api/applications/cancel/{applicationId}  # 채용 지원을 취소합니다.
GET /api/applications                          # 지원 내역을 조회합니다.
POST /api/applications/bookmark/{jobId}        # 채용 공고를 관심 목록에 추가합니다.
DELETE /api/applications/bookmark/{jobId}      # 채용 공고를 관심 목록에서 제거합니다.
GET /api/applications/bookmarks                # 관심 목록을 조회합니다.
```
### **Auth**
**인증 관련 엔드포인트:**
```
POST /api/auth/register      # 회원가입을 진행합니다.
POST /api/auth/login         # 로그인을 진행합니다.
POST /api/auth/logout        # 로그아웃을 진행합니다.
POST /api/auth/refresh-token # 인증 토큰을 갱신합니다.
```
### **Bookmarks**
**관심 목록 관리 엔드포인트:**
```
POST /api/bookmarks/toggle/{jobId} # 채용 공고 북마크 상태를 토글(추가/제거)합니다.
GET /api/bookmarks                 # 사용자 북마크 목록을 조회합니다.
```
### **Jobs**
**채용 공고 관리 엔드포인트:**
```
POST /api/jobs                             # 새로운 채용 공고를 생성합니다 (관리자 권한 필요).
GET /api/jobs                              # 모든 채용 공고를 조회합니다.
GET /api/jobs/search                       # 키워드, 회사명 또는 직위로 채용 공고를 검색합니다.
GET /api/jobs/filter                       # 조건에 따라 채용 공고를 필터링합니다.
GET /api/jobs/sort                         # 채용 공고를 정렬합니다.
GET /api/jobs/aggregate/industry-count     # 산업별 채용 공고 수를 집계합니다.
GET /api/jobs/aggregate/average-salary     # 산업별 평균 연봉을 집계합니다.
GET /api/jobs/{id}                         # 특정 채용 공고의 상세 정보를 조회합니다.
PUT /api/jobs/{id}                         # 특정 채용 공고를 수정합니다 (관리자 권한 필요).
DELETE /api/jobs/{id}                      # 특정 채용 공고를 삭제합니다 (관리자 권한 필요).
```
### **Reviews**
**채용 리뷰 관리 엔드포인트:**
```
POST /api/reviews/{jobId} # 특정 채용 공고에 리뷰를 작성합니다.
GET /api/reviews/{jobId}  # 특정 채용 공고의 리뷰를 조회합니다.
```
### **Skills**
**스킬 관리 엔드포인트:**
```
POST /api/skills         # 새로운 스킬을 생성합니다 (관리자 권한 필요).
GET /api/skills          # 모든 스킬을 조회합니다.
GET /api/skills/{id}     # 특정 스킬을 조회합니다.
PUT /api/skills/{id}     # 특정 스킬을 수정합니다 (관리자 권한 필요).
DELETE /api/skills/{id}  # 특정 스킬을 삭제합니다 (관리자 권한 필요).
```
### **Users**
**사용자 프로필 관리 엔드포인트:**
```
GET /api/users/me    # 현재 사용자의 프로필 정보를 조회합니다.
PUT /api/users/me    # 현재 사용자의 프로필 정보를 수정합니다.
DELETE /api/users/me # 현재 사용자의 계정을 삭제합니다.
```
### 참고 사항
- `(관리자 권한 필요)`가 표시된 엔드포인트는 관리자 권한이 필요합니다.
- 모든 엔드포인트는 별도의 언급이 없는 한 인증이 필요합니다.




