const express = require('express')
const slugify = require('slugify')
const router = express.Router();
const db = require("../db");
const ExpressError = require('../ExpressError');

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM industries`);
      const results2 = await db.query(`SELECT * FROM companies`);
      const responseData = {
        industries: results.rows,
        companies: results2.rows
      }
      return res.json(responseData);
    } catch (error) {
      return next(error)
    }
});

router.get('/:code', async (req, res, next) => {
    try {
      let code = req.params.code
      const results = await db.query(`SELECT * FROM industries
                                      WHERE code=$1`,
                                      [code]);
      if (results.rows.length === 0) {
        throw new ExpressError(`No such industry: ${code}`, 404)
      } else {
        return res.json(results.rows)
      }
    } catch (error) {
      return next(error)
    }
})

module.exports = router;