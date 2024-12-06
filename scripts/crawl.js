// scripts/crawl.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crawlSaramin = require('../services/crawler');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Category = require('../models/Category');
const Skill = require('../models/Skill');
const parseDate = require('../utils/parseDate');

dotenv.config();

const keyword = '백엔드'; // 검색 키워드
const pagesToCrawl = 5; // 크롤링할 페이지 수

const main = async () => {
  try {
    // 데이터베이스 연결
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 연결 성공');

    // 크롤링 실행
    const jobs = await crawlSaramin(keyword, pagesToCrawl);
    console.log(`총 ${jobs.length}개의 채용 공고 수집`);

    // 데이터베이스에 저장
    for (const jobData of jobs) {
      try {
        console.log(`수집된 채용 공고: ${jobData.title}, 마감일: ${jobData.deadline}`);

        // 마감일 파싱
        let deadlineDate = parseDate(jobData.deadline);

        if (jobData.deadline === '상시채용') {
          deadlineDate = null; // 마감일 없음
        } else if (!deadlineDate) {
          console.warn(`유효하지 않은 마감일 데이터: ${jobData.deadline}`);
          // 필요 시, 해당 공고를 건너뜁니다.
          continue;
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

    console.log('데이터베이스 저장 완료');
    mongoose.disconnect();
  } catch (err) {
    console.error('크롤링 및 저장 중 에러 발생:', err.message);
    mongoose.disconnect();
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



main();
