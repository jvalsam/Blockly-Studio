
module.exports.check = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        //TODO: replace
        //res.redirect("/auth/login");
        //temporarily use tina as login user
        req.session.user = {
            _id: "5ac8e06dac135912cc2314ac",
            username: "wtina"
        }
        next();
    }
};
