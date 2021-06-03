/* istanbul ignore next */
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};
/* istanbul ignore next */
module.exports = {
  generateMessage,
};
