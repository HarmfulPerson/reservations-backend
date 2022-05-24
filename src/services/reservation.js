const isDate = (dateStr) => !Number.isNaN(new Date(dateStr).getDate());

module.exports.isDateValid = (startDate, endDate) => {
  if (!isDate(startDate)) return false;
  if (!isDate(endDate)) return false;
  if (new Date(startDate).getTime() > new Date(endDate).getTime()) return false;
};
