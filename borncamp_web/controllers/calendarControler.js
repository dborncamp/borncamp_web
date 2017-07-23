/**
 * GET /
 * Calendar page.
 */
exports.calendar = (req, res) => {
    res.render('calendar', {
        title: 'Calendar'
    });
};