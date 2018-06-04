/**
 * GET /
 * shader page.
 */
exports.shaders = (req, res) => {
    res.render('webgl', {
        title: "WebGL fun"
    });
};