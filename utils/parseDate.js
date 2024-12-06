// utils/parseDate.js
const { parse, isValid } = require('date-fns');

const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // "상시채용" 같은 경우
  if (dateString === '상시채용') {
    return null;
  }
  
  // "~ MM/DD(요일)" 형식 처리
  const regexRelative = /^~\s*(\d{1,2})\/(\d{1,2})\([가-힣]{1}\)$/;
  const matchRelative = dateString.match(regexRelative);
  if (matchRelative) {
    const month = parseInt(matchRelative[1], 10);
    const day = parseInt(matchRelative[2], 10);
    const year = new Date().getFullYear();
    const parsedDate = parse(`${year}-${month}-${day}`, 'yyyy-M-d', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // "YYYY.MM.DD" 또는 "YYYY-MM-DD" 형식 처리
  const regexDate = /^\d{4}[.-]\d{1,2}[.-]\d{1,2}$/;
  if (regexDate.test(dateString)) {
    const parsedDate = parse(dateString, 'yyyy.MM.dd', new Date()) || parse(dateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  console.warn(`유효하지 않은 날짜 형식: ${dateString}`);
  return null;
};

module.exports = parseDate;
