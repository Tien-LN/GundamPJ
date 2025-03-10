const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = hashedPassword;
