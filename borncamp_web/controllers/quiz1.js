/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render('quiz1', {
        title: 'Things'
    });
};