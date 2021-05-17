// Routes for companies 

const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const db = require("../db");
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
        return res.json({ "companies": results.rows })
    } catch (e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        
        const { code } = req.params;
        const companyResults = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);
        const invoiceResults = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [code]);
        const industryResults = await db.query(
            `SELECT c.code, c.name, i.industry
            FROM companies AS c
            LEFT JOIN companies_industries AS ci
            ON c.code = ci.company_code
            LEFT JOIN industries AS i
            ON ci.industry_code = i.code
            WHERE c.code = $1`,
            [code]);
        
        if (companyResults.rows.length === 0) {
            throw new ExpressError(`Cannot find the company with the code of ${code}`, 404)
        }
        
        const company = companyResults.rows[0];
        const invoices = invoiceResults.rows;
        company.invoices = invoices.map(inv => inv.id);
        
        const industries = industryResults.rows;
        company.industries = industries.map(ind => ind.industry);

        return res.json({ "company": company });

    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let { name, description } = req.body;
        let code = slugify(name, {lower: true});
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ "company": results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        let code = req.params.code;
        let { name, description } =  req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Cannot find company with the code ${code}`, 404)
        }
        return res.json({ "company": results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const results = await db.query('DELETE FROM companies WHERE code = $1 RETURNING code', [req.params.code]);
        if (results.rows.length == 0) {
            throw new ExpressError(`Could not find company: ${code}`, 404)
        }
        return res.json({ status: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})

module.exports = router;