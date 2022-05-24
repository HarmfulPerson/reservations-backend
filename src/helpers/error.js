module.exports = class CustomError extends Error {
  constructor(status = 500, msg = 'Something went wrong') {
    super(msg);
    this.status = status;
  }
};
