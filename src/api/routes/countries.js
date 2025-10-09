

const { isAuth } = require("../../middlewares/auth/auth");
const { getCountries } = require("../controllers/countries");




const countriesRouter = require('express').Router();

countriesRouter.get('/', isAuth, getCountries);


module.exports = countriesRouter;