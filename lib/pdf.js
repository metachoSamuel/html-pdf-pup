const puppeteer = require('puppeteer');
const { Readable } = require('stream');
const assert = require('assert');

/**
* Puppeteer version 1.19.0
*
* Create a PDF file out of html string.
*
* Regions for the PDF page are:
*
* @author Samuel Forero
*
*/

function PDF(html, options) {
    this.html = html;
    this.options = options || {};

    // Initialize other properties and options as needed
    // ...

    assert(typeof this.html === 'string' && this.html.length, "html-pdf: Can't create a pdf without an html string");
    this.options.timeout = parseInt(this.options.timeout, 10) || 30000;
}

PDF.prototype.toBuffer = async function PdfToBuffer(callback) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(this.html);

        const pdfBuffer = await page.pdf(this.options);
        await browser.close();

        callback(null, pdfBuffer);
    } catch (err) {
        callback(err, null);
    }
};

PDF.prototype.toStream = async function PdfToStream(callback) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(this.html);

        const pdfBuffer = await page.pdf(this.options);
        await browser.close();

        const stream = new Readable();
        stream.push(pdfBuffer);
        stream.push(null);

        callback(null, stream);
    } catch (err) {
        callback(err, null);
    }
};

PDF.prototype.exec = async function PdfExec(callback) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(this.html);

    try {
        const pdfBuffer = await page.pdf(this.options);
        await browser.close();
        callback(null, pdfBuffer);
    } catch (err) {
        await browser.close();
        callback(err, null);
    }
};

module.exports = PDF;