const express = require('express')
const slugify = require('slugify')
const router = express.Router();
const db = require("../db");
const ExpressError = require('../ExpressError');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`
        SELECT
          companies.code AS code,
          companies.name AS name,
          companies.description AS description,
          industries.industry AS industry
        FROM
          companies
        LEFT JOIN
          company_industries ON code = company_industries.company_code
        LEFT JOIN
          industries ON company_industries.industry_code = industries.code;
        `)
        return res.json(results.rows)
    } catch (error) {
        return next(error)
    }
})

module.exports = router;