import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for getting all zones
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    // code here for getting all zones through zonesModel
});

export default router;
