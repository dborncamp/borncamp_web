/**
 * GET /
 * The page.
 */
exports.index = (req, res) => {
    res.render('slides', {
        title: "Slides using Reveal.js"
    });
};

/**
 * GET /
 * The about me slides.
 */
exports.aboutme = (req, res) => {
    res.render('aboutme_slides', {
        title: "About Me Slides"
    });
};