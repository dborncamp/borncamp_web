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

/**
 * GET /
 * The rocketlabs.
 */
exports.rocketlabs = (req, res) => {
    res.render('rocketlabs_slides', {
        title: "RocketLabs Code Challenge"
    });
};
