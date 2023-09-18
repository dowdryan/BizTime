const express = require('express')
const slugify = require('slugify')
const router = express.Router();
const db = require("../db");
const ExpressError = require('../ExpressError');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json(results.rows)
    } catch (error) {
        return next(error)
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const id = req.params.id
        const results = await db.query(`SELECT * FROM invoices
                                        WHERE id=$1`,
                                        [id])
        if (results.rows.length === 0) {
            throw new ExpressError("Invalid ID", 404)
        } else {
            return res.json(results.rows)
        }
    } catch (error) {
        return next(error)
    }
})

router.post('/', async(req, res, next) => {
    try {
        const {comp_code, amt} = req.body
        const results = await db.query(`INSERT INTO invoices (comp_code, amt)
                                        VALUES ($1, $2)
                                        RETURNING *`,
                                        [comp_code, amt])
        return res.json({"invoice": results.rows[0]})
    } catch (error) {
        return next(error)
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const id = req.params.id
        const {amt, has_paid} = req.body
        let paidDate = null
        const currentResults = await db.query(`SELECT has_paid
                                                FROM invoices
                                                WHERE id=${id}`)
        if (currentResults.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
        const currentPaidDate = currentResults.rows[0].paid_date;
        if (!currentPaidDate && has_paid) {
            paidDate = new Date()
        } else if (!has_paid) {
            paidDate = null
        } else {
            paidDate = currentPaidDate
        }
        const results = await db.query(`UPDATE invoices
                                        SET amt=${amt}, has_paid=${has_paid}
                                        WHERE id=${id}
                                        RETURNING *`)
        return res.json(results.rows)
    } catch (error) {
        return next(error)
    }
})

router.delete(' /:id', async(req, res, next) => {
    try {
        const id = req.params.id
        const results = await db.query(`DELETE FROM invoices
                                        WHERE id=${id}
                                        RETURNING id`)
        if (results.rows.length == 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({"status": "deleted"})
        }
    } catch (error) {
        return next(error)
    }
})

module.exports = router;