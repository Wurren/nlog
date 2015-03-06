
var Mongorito = require('mongorito'),
    Model     = Mongorito.Model,
    cryptp    = require('crypto');


class Token extends Model {}

module.exports = Token;