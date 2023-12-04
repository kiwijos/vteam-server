import { db } from "./db.js"


const card = {
    getTypes: async function() {
        const result = await db.queryNoArgs(`CALL card_types();`);
        return result[0];
    },
    /**
     * Returns card_nr, card_type
     * and card_type_descr
     * @param {Number} userId 
     * @returns {Promise<Object>}
     */
    userDetails: async function(userId) {
        const result = await db.queryWithArgs(`CALL user_card(?);`, [userId]);
        return result[0][0];
    },
    /**
     * 
     * @param {Number} userId 
     * @param {String} cardnr 
     * @param {Number} cardType 
     * @returns {Promise<Object>}
     */
    updUserDetails: async function(userId, cardnr, cardType) {
        const result = await db.queryWithArgs(`CALL upd_user_card(?, ?, ?);`, [userId, cardnr, cardType]);
        return result[0][0];
    },
    
};

export default card;
