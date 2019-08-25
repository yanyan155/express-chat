const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(process.env.MONGODB_URI || config.get('mongoose:uri'), config.get('mongoose:options'))

module.exports = mongoose;