module.exports = (res, error) => {
    res.status(500).json({
        saccess: false,
        message: error.message ? error.message : error
    });
};
