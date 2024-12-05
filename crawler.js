// crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('./models/Job');
const mongoose = require('mongoose');
require('dotenv').config();

const crawlSaramin = async (keyword, pages = 1) => {
  const jobs = [];
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  for (let page = 1; page <= pages; page++) {
    const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(
      keyword
    )}&recruitPage=${page}`;

    try {
      const response = await axios.get(url, { headers });
      const html = response.data;
      const $ = cheerio.load(html);
      const jobListings = $('.item_recruit');

      jobListings.each((index, element) => {
        try {
          const company = $(element).find('.corp_name a').text().trim();
          const title = $(element).find('.job_tit a').text().trim();
          const link =
            'https://www.saramin.co.kr' +
            $(element).find('.job_tit a').attr('href');

          const conditions = $(element).find('.job_condition span');
          const location =
            conditions.length > 0 ? $(conditions[0]).text().trim() : '';
          const experience =
            conditions.length > 1 ? $(conditions[1]).text().trim() : '';
          const education =
            conditions.length > 2 ? $(conditions[2]).text().trim() : '';
          const employmentType =
            conditions.length > 3 ? $(conditions[3]).text().trim() : '';

          const deadline = $(element).find('.job_date .date').text().trim();

          const jobSector = $(element).find('.job_sector');
          const sector = jobSector.text().trim() || '';

          const salaryBadge = $(element).find('.area_badge .badge');
          const salary = salaryBadge.text().trim() || '';

          jobs.push({
            company,
            title,
            link,
            location,
            experience,
            education,
            employmentType,
            deadline,
            sector,
            salary,
          });
        } catch (err) {
          console.error('항목 파싱 중 에러 발생:', err.message);
        }
      });

      console.log(`${page}페이지 크롤링 완료`);
      await delay(process.env.CRAWLER_DELAY || 1000); // 서버 부하 방지를 위한 딜레이
    } catch (err) {
      console.error(`페이지 요청 중 에러 발생 (페이지 ${page}):`, err.message);
      // 재시도 로직 (예: 최대 3회 시도)
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`재시도 ${attempt}회차`);
          const response = await axios.get(url, { headers });
          const html = response.data;
          const $ = cheerio.load(html);
          const jobListings = $('.item_recruit');

          jobListings.each((index, element) => {
            try {
              const company = $(element).find('.corp_name a').text().trim();
              const title = $(element).find('.job_tit a').text().trim();
              const link =
                'https://www.saramin.co.kr' +
                $(element).find('.job_tit a').attr('href');

              const conditions = $(element).find('.job_condition span');
              const location =
                conditions.length > 0 ? $(conditions[0]).text().trim() : '';
              const experience =
                conditions.length > 1 ? $(conditions[1]).text().trim() : '';
              const education =
                conditions.length > 2 ? $(conditions[2]).text().trim() : '';
              const employmentType =
                conditions.length > 3 ? $(conditions[3]).text().trim() : '';

              const deadline = $(element).find('.job_date .date').text().trim();

              const jobSector = $(element).find('.job_sector');
              const sector = jobSector.text().trim() || '';

              const salaryBadge = $(element).find('.area_badge .badge');
              const salary = salaryBadge.text().trim() || '';

              jobs.push({
                company,
                title,
                link,
                location,
                experience,
                education,
                employmentType,
                deadline,
                sector,
                salary,
              });
            } catch (err) {
              console.error('항목 파싱 중 에러 발생:', err.message);
            }
          });

          console.log(`${page}페이지 크롤링 완료 (재시도)`);
          await delay(process.env.CRAWLER_DELAY || 1000);
          break; // 성공하면 루프 종료
        } catch (retryErr) {
          console.error(`재시도 ${attempt}회차 실패:`, retryErr.message);
          if (attempt === 3) {
            console.error('재시도 3회 실패. 다음 페이지로 이동합니다.');
          }
        }
      }
    }
  }

  return jobs;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = crawlSaramin;
