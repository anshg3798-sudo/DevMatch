// middleware/roleMiddleware.js

const isRecruiter = (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Access denied. Recruiters only."
        });
    }

    next();
};

const isStudent = (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Access denied. Students only."
        });
    }

    next();
};

module.exports = {
    isRecruiter,
    isStudent
};