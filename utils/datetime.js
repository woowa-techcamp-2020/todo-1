const add = require('date-fns/add');
const format = require('date-fns/format');
const DEFAULT_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

module.exports = {
  add,
  format,
  getCurrentWithFormat: (formatStr = DEFAULT_DATETIME_FORMAT) => {
    return format(new Date(), formatStr);
  },
  getFormatWithAdd: (seconds, formatStr = DEFAULT_DATETIME_FORMAT) => {
    const date = add(new Date(), { seconds });
    return format(date, formatStr);
  },
};
