import express from "express";

const CACHE_LIFETIME = 30 * 1000; // 30 seconds in milliseconds

/**
 * Manages client and bike connections with caching.
 */
const clientManager = {
    /** @type {Array<express.Response>} */
    clients: [],

    /** 
     * @type {Object<string, {res: express.Response | null}>} 
     */
    cachedBikeData: {},

    /**
     * Adds a new client to the clients array.
     * @param {express.Response} client - The client to add.
     */
    addClient(client) {
        this.clients.push(client);
    },

    /**
     * Removes a client from the clients array.
     * @param {express.Response} client - The client to remove.
     */
    removeClient(client) {
        this.clients = this.clients.filter(c => c !== client);
    },

    /**
     * Initializes a new bike entry in the cache.
     * @param {Number} bikeId - The bike ID.
     * @param {express.Response} res - The bike connection response to add.
     */
    addBike(bikeId, res) {
        this.cachedBikeData[bikeId] = {
            res: res
        };
    },

    /**
     * Removes a bike's res key (and value) from the cache object
     * @param {Number} bikeId - Id of the bike for which to set res to null
     */
    removeBike(bikeId) {
        this.cachedBikeData[bikeId].res = null
    },

    /**
     * Broadcasts a message to all clients.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToClients(message) {
        message = JSON.stringify(message)
        this.clients.forEach(client => client.write(`data: ${message}\n\n`));
    },


    /**
     * Broadcasts a message to a specific bike.
     * @param {Number} bikeId - The ID of the bike to which the message should be broadcast.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToBikes(bikeId, message) {
        const bike = this.cachedBikeData[bikeId];
        message = JSON.stringify(message)

        // If statements can be changed to something better.
        if (bike && bike.res) {
            bike.res.write(`data: ${message}\n\n`);
        }

        if (bikeId === -1) {
            for (const bike of Object.values(this.cachedBikeData)) {
                if (bike.res) {
                    bike.res.write(`data: ${message}\n\n`);
                }
            }
        }
    }
};

export default clientManager;
