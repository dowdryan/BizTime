const express = require('express')
const slugify = require('slugify')
const router = express.Router();
const db = require("../db");
const ExpressError = require('../ExpressError');

router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM companies`);
      return res.json(results.rows);
    } catch (error) {
      return next(error)
    }
});

router.get('/:code', async (req, res, next) => {
  try {
    let code = req.params.code
    const results = await db.query(`SELECT * FROM companies
                                    WHERE code=$1`,
                                    [code]);
    if (results.rows.length === 0) {
      const invalidCompanyError = new Error("The company you provided does not exist.")
      invalidCompanyError.status = 404;
      return next(invalidCompanyError)
    } else {
      return res.json(results.rows)
    }
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    let {name, description} = req.body
    let code = slugify(name, {lower: true})
    if (!name || !description) {
      const invalid = new Error("Invalid Values")
      invalid.status = 400
      return next(error)
    }
    const results = await db.query(`INSERT INTO companies(code, name, description)
                                    VALUES ($1, $2, $3)
                                    RETURNING code, name, description`,
                                    [code, name, description])
    return res.status(201).json({company: results.rows[0]})
  } catch (error) {
    return next(error)
  }
})

router.put('/:code', async (req, res, next) => {
  try {
    const {code} = req.params
    const {name, description} = req.body
    const results = await db.query(`UPDATE companies
                                    SET name=$1, description=$2
                                    WHERE code=$3
                                    RETURNING code, name, description`,
                                    [name, description, code])
    if (results.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.status(201).json({"Company": results.rows[0]})
    }
  } catch (error) {
    return next(error)
  }
})

router.delete('/:code', async(req, res, next) => {
  try {
    let code = req.params.code
    const results = await db.query(`DELETE FROM companies
                                    WHERE code=$1
                                    RETURNING code`,
                                    [code])
    if (results.rows.length == 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.json({"status": "deleted"});
    }
  } catch (error) {
    return next(error)
  }
})

module.exports = router;