const express = require("express");
const app = express();
const ExpressError = require("./ExpressError")
const companies = require('./routes/companies')
const invoices = require('./routes/invoices')
const industries = require('./routes/industries')
const company_industries = require('./routes/industries')

app.use(express.json());
app.use('/companies', companies)
app.use('/invoices', invoices)
app.use('/industries', industries)
app.use('/company_industries', company_industries)

app.get('/', (req, res) => {
  console.log("Title:", req.param('title'));
  res.end()
})

/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(3000, function() {
    console.log("Server starting on port 3000!")
})

module.exports = app;
