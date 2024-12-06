// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimitMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const skillRoutes = require('./routes/skillRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cron = require('node-cron');
const crawlSaramin = require('./services/crawler');
const parseDate = require('./utils/parseDate');
const Company = require('./models/Company');
const Category = require('./models/Category');
const Skill = require('./models/Skill');
const Job = require('./models/Job');
const { required } = require('joi');
const errorHandler = require('./middleware/errorHandler'); // 글로벌 에러 핸들러

dotenv.config(); // 기본적으로 .env 파일 로드 

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://your-frontend-domain.com', // 실제 프론트엔드 도메인으로 변경
  optionsSuccessStatus: 200
}));
app.use(rateLimiter);

// Swagger 설정
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Board API',
      version: '1.0.0',
      description: '채용 공고 관리 API 문서',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // 아래에 컴포넌트 스키마를 정의합니다.
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            website: { type: 'string' },
            location: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['name']
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            company: { $ref: '#/components/schemas/Company' },
            link: { type: 'string' },
            location: { type: 'string' },
            experience: { type: 'string' },
            education: { type: 'string' },
            employmentType: { type: 'string' },
            deadline: { type: 'string', format: 'date-time' },
            sector: { $ref: '#/components/schemas/Category' },
            skills: {
              type: 'array',
              items: { $ref: '#/components/schemas/Skill' },
            },
            salary: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            job: { $ref: '#/components/schemas/Job' },
            resume: { type: 'string' },
            coverLetter: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // Bookmark 스키마 추가
        Bookmark: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            job: { $ref: '#/components/schemas/Job' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Review 스키마 추가
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            job: { $ref: '#/components/schemas/Job' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            feedback: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Access Token 및 Refresh Token 스키마
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // 모든 라우트 파일을 참조
};

const specs = swaggerJsdoc(options);

// Swagger 라우트 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/skills', skillRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Job Board API');
});

// 글로벌 에러 핸들러 등록 (모든 라우트 후에 등록)
app.use(errorHandler);

// 서버 시작 부분을 함수로 분리
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
  
    });
    console.log('MongoDB 연결 성공');

    const server = app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 시작되었습니다.`));
    module.exports = server; // Jest 테스트를 위해 내보냄

    // 크롤링 작업 주기적 실행 (매일 오전 2시에 실행)
    cron.schedule('0 2 * * *', async () => {
      console.log('크롤링 작업 시작');
      const keyword = '백엔드';
      const pagesToCrawl = 5;
      const jobs = await crawlSaramin(keyword, pagesToCrawl);
      console.log(`총 ${jobs.length}개의 채용 공고 수집`);

      for (const jobData of jobs) {
        try {
          console.log(`수집된 채용 공고: ${jobData.title}, 마감일: ${jobData.deadline}`);

          // 마감일 파싱
          let deadlineDate = parseDate(jobData.deadline);

          // 마감일이 '상시채용'인 경우 null 설정
          if (jobData.deadline === '상시채용') {
            deadlineDate = null;
          }

          // 회사 정보 저장 또는 기존 정보 사용
          let company = await Company.findOne({ name: jobData.company });
          if (!company) {
            company = new Company({
              name: jobData.company,
              website: '', // 필요 시 추가
              location: jobData.location,
              // 기타 회사 정보
            });
            await company.save();
          }

          // 직무 분야 저장 또는 기존 정보 사용
          let category = await Category.findOne({ name: jobData.sector });
          if (!category) {
            category = new Category({
              name: jobData.sector,
              description: '', // 필요 시 추가
            });
            await category.save();
          }

          // 필요 기술 저장 또는 기존 정보 사용
          const skillNames = extractSkillsFromJobTitle(jobData.title);
          const skills = [];
          for (const skillName of skillNames) {
            let skill = await Skill.findOne({ name: skillName });
            if (!skill) {
              skill = new Skill({
                name: skillName,
                description: '', // 필요 시 추가
              });
              await skill.save();
            }
            skills.push(skill._id);
          }

          // 채용 공고 저장 (업서트)
          const result = await Job.updateOne(
            { link: jobData.link },
            {
              $setOnInsert: {
                title: jobData.title,
                company: company._id,
                location: jobData.location,
                experience: jobData.experience,
                education: jobData.education,
                employmentType: jobData.employmentType,
                deadline: deadlineDate,
                sector: category._id,
                skills: skills,
                salary: jobData.salary,
                link: jobData.link,
              },
            },
            { upsert: true }
          );

          if (result.upserted) {
            console.log(`새로운 채용 공고 저장됨: ${jobData.title}`);
          } else {
            console.log(`이미 존재하는 채용 공고: ${jobData.title}`);
          }
        } catch (err) {
          if (err.code === 11000) { // 중복 키 에러
            console.error(`중복된 링크로 인한 저장 실패: ${jobData.link}`);
          } else if (err.name === 'CastError' && err.path === 'deadline') {
            console.error(`마감일 필드 캐스트 에러: ${jobData.deadline}`);
          } else {
            console.error('데이터 저장 중 에러 발생:', err.message);
          }
        }
      }

      console.log('크롤링 작업 완료');
    });

  } catch (err) {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  }
};

// 직무 제목에서 기술 추출 함수 예시
const extractSkillsFromJobTitle = (title) => {
  const skills = [];
  const skillKeywords = ['JavaScript', 'Node.js', 'Python', 'Java', 'React', 'Angular', 'Django'];
  skillKeywords.forEach((skill) => {
    if (title.includes(skill)) {
      skills.push(skill);
    }
  });
  return skills;
};



startServer();
