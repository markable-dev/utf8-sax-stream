const Sax = require('sax-stream');

const { _transform } = Sax.prototype;
Sax.prototype._rawTransform = _transform;
Sax.prototype._utf8Transform = function (chunk, encoding, callback) {
    if (!this._decoder) {
        var SD = require('string_decoder').StringDecoder;
        this._decoder = new SD('utf8');
    }
    chunk = this._decoder.write(chunk);
    this._rawTransform(chunk, encoding, callback);
};
Sax.prototype._transform = Sax.prototype._utf8Transform;

Sax.getStrictSax = (options = {}) => Sax({ strict: true, trim: true, ...options });

module.exports = Sax;
