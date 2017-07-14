/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render('landing', {
        title: 'Dave Borncamp'
    });
};