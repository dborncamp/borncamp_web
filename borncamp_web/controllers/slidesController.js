/**
 * GET /
 * The page.
 */
exports.index = (req, res) => {
    res.render('aboutme_slides', {
        title: "About Me Slides"
    });
};