/**
 * GET /
 * The page.
 */
exports.index = (req, res) => {
    res.render('resume', {
        title: "Dave's Resume"
    });
};