const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await db.sync({ alter: true });
    try {
      await db.authenticate();
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    console.log(error);
    return error;
  }
});

module.exports = router;
