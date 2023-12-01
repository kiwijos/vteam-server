import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for getting all cities
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    // code here for getting all cities through citiesModel
});

/**
 * @description Route for getting one city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    // code here for getting one city through citiesModel
});

/**
 * @description Route for getting all bikes of a city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/bikes", async (req, res, next) => {
    // code here for getting all bikes of a city
});

/**
 * @description Route for getting all zones of a city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/zones", async (req, res, next) => {
    // code here for getting all zones of a city
});

export default router;
