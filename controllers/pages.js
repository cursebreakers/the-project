// pages.js - Markdown doc reader

const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const md = markdownIt();

// Controller function for rendering Markdown content
exports.get_docs = async (req, res, next) => {
    try {
        let { page } = req.params;

        const docsDirectory = path.join(__dirname, '..', 'docs');

        if (!page) {
            page = 'index';
        }

        const filePath = path.join(docsDirectory, `${page}.md`);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Document unavailable:', err);
                return res.status(500).send('No such document');
            }
            const htmlContent = md.render(data);
            res.render('pages', { markdownContent: htmlContent });
        });
    } catch (error) {
        console.error('Error rendering Markdown:', error);
        res.status(500).send('Error rendering Markdown');
    }
};

// Controller function for rendering the terms page
exports.get_terms = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '..', 'docs', 'terms.md');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading terms file:', err);
                return res.status(500).send('Error reading terms file');
            }
            const htmlContent = md.render(data);
            res.render('pages', { markdownContent: htmlContent });
        });
    } catch (error) {
        console.error('Error rendering terms page:', error);
        res.status(500).send('Error rendering terms page');
    }
};

module.exports = {
    get_docs: exports.get_docs,
    get_terms: exports.get_terms
};