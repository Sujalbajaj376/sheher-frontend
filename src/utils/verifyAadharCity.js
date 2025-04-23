// verifyAadharCity.js
const mapping = {
  "12": "Jaipur",
  "34": "Delhi",
  "56": "Mumbai",
};

export function verifyAadharCity(aadharDigits, city) {
  return mapping[aadharDigits] === city;
}
