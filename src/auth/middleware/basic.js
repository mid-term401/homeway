'use strict';

const base64 = require('base-64');
// const User = require('../models/users.js');

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let basic = req.headers.authorization.split(' ').pop();
      let [user, pass] = base64.decode(basic).split(':');
  
      req.user = await User.authenticateBasic(user, pass)
      next();
    } else {
      res.status(403).send("Invalid Login");
    }
  } catch (e) {
    res.send(e.message);
  }
}