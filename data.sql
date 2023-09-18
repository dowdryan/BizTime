DROP DATABASE IF EXISTS biztime;
CREATE DATABASE biztime;
\c biztime;

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS invoices;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(300)
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt FLOAT NOT NULL,
    has_paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, has_paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

-- Further Study
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industries;

CREATE TABLE industries (
  code VARCHAR(20) PRIMARY KEY,
  industry VARCHAR(20) NOT NULL
);

INSERT INTO industries
  VALUES ('Acct', 'Accounting'),
         ('HR', 'Human Resources');

CREATE TABLE company_industries (
  company_code text REFERENCES companies(code) ON DELETE CASCADE,
  industry_code VARCHAR(20) REFERENCES industries(code) ON DELETE CASCADE,
  PRIMARY KEY (company_code, industry_code)
);

INSERT INTO company_industries (company_code, industry_code)
  VALUES ('apple', 'Acct'),
         ('apple', 'HR'),
         ('ibm', 'HR');