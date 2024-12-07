// utils/parseDate.js
const parseDate = (dateString) => {
  if (!dateString || dateString.toLowerCase() === '상시채용') {
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('유효한 날짜가 아닙니다!');
  }

  return date;
};

module.exports = parseDate;
