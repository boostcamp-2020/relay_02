const moment = require('moment');

function formatMessage(username, text, user_image_path) {
  return {
    user_image_path,
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
