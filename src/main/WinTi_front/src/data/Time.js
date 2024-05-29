// Time.js
const CURRENT_YEAR = new Date().getFullYear();
const MINIMUM_BIRTH_YEAR = CURRENT_YEAR - 14;
const YEAR = [];
for (let i = MINIMUM_BIRTH_YEAR; i >= MINIMUM_BIRTH_YEAR - 100; i--) {
  YEAR.push(i);
}

const MONTH = [];
for (let i = 1; i <= 12; i++) {
  MONTH.push(i);
}

const DAY = [];
for (let i = 1; i <= 31; i++) {
  DAY.push(i);
}

export { YEAR, MONTH, DAY };
