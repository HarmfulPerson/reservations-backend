const express = require('express');
const db = require('../config/db');
const { handleSeeds } = require('../config/seed');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    try {
      await db.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    await db.sync({ alter: true });
    console.log(db.models);
    console.log('xDD');
    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    return error;
  }
});

// router.get('/force', async (req, res) => {
//   try {
//     await forceInit();

//     res.status(200).json({
//       success: true,
//       message: 'synchronised',
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
