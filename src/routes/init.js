const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await db.sync({ alter: true });

    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    return error;
  }
});

module.exports = router;
