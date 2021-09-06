const saxStream = require('sax-stream');
const chai = require('chai');
const path = require('path');
const fs = require('fs');
require('../index');

const { expect } = chai;
const XML_PATH = path.join(__dirname, './fixtures/test.xml');

describe('SaxStream', () => {
    let sax, fileStream;
    beforeEach(() => {
        fileStream = fs.createReadStream(XML_PATH, { highWaterMark: 128 });
        sax = saxStream({
            strict: true,
            tag: 'url',
            highWaterMark: 1,
        });
    });
    describe('Raw version', () => {
        it('should corrupt utf8 charactors', (cb) => {
            if (sax._rawTransform) {
                sax._transform = sax._rawTransform;
            }

            let count = 0;
            fileStream.pipe(sax)
                .on('data', (chunk) => {
                    count++;
                    expect(chunk.children.data.children.a.value.indexOf('�')).to.gte(0);
                })
                .on('error', cb)
                .on('end', () => {
                    expect(count).to.equals(1);
                    cb();
                });
        });
    });

    describe('Patched version', () => {
        it('should pass', (cb) => {
            let count = 0;
            fileStream.pipe(sax)
                .on('data', (chunk) => {
                    count++;
                    expect(chunk.children.data.children.a.value.indexOf('�')).to.equals(-1);
                })
                .on('error', cb)
                .on('end', () => {
                    expect(count).to.equals(1);
                    cb();
                });
        });
    });
});
