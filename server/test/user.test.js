/* global it describe */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";
import { users } from './dummy-data/users.js';

import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;


describe('user model', () => {

    // // ok token
    // const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    // // expired token
    // const expiredPayload = {
    //     ...payload,
    //     iat: Math.floor(Date.now() / 1000) - 3600,
    //     exp: Math.floor(Date.now() / 1000) - 1800
    // };
    // const expiredToken = jwt.sign(expiredPayload, jwtSecret);
    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`;

        let args = [];

        for (const user of users) {
            args = args.concat([user.id, user.email, user.card, user.card_type, user.balance, user.active]);
        }
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    afterEach(() => {
        sinon.restore();
    });
    it('registers new user in database', async () => {
        let user = await userModel.insertIntoDB(
            "testuser@email.com",
            "1234 5678 9123 4567",
            3
        )

        expect(Object.keys(user).length).to.equal(2);
        expect(user.email).to.equal("testuser@email.com");
        expect(user.id).to.be.a('number');

        const searchRes = await userModel.search("testuser@email.com");
        user = searchRes[0];
        expect(Object.keys(user).length).to.equal(4);
        expect(user.email).to.equal("testuser@email.com");
        expect(user.id).to.be.a('number');
        expect(user.balance).to.equal(0.00);
        expect(user.active).to.be.true;
    });
    it('registers new user in database, email missing', async () => {
        try {
            // try passing undefined instead of email
            await userModel.insertIntoDB(
                undefined,
                "1234 5678 9123 4567",
                3
            )
            throw new Error('Expected SqlError (email column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'email' cannot be null");
        }

        const users = await userModel.all();
        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });

    it('registers new user in database, cardnr missing', async () => {
        try {
            // try passing undefined instead of email
            await userModel.insertIntoDB(
                "the@newuser.com",
                undefined,
                3
            )
            throw new Error('Expected SqlError (card_nr column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'card_nr' cannot be null");
        }
        try {
            // make sure the user has not been registered
            await userModel.search("the@newuser.com");

            throw new Error('Expected SqlError (No users matched the search-criteria)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include("No users matched the search-criteria");
        }
    });
    it('get all users', async () => {
        const users = await userModel.all()
        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('user serach exact id ok', async () => {
        const users = await userModel.search(6);
        expect(users[0]).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
            balance: -128.53,
            active: true,
        });
    });
    it('user search exact id not ok', async () => {
        try {
            await userModel.search(8);
            throw new Error("Expected SqlError (No users matched the search-criteria)");
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include("No users matched the search-criteria");
        }
    });
    it('user serach exact email ok', async () => {
        const users = await userModel.search("jdoniso4@alibaba.com");
        expect(users[0]).to.deep.equal({
            id: 4,
            email: "jdoniso4@alibaba.com",
            balance: 261.93,
            active: true,
        });
    });
    it('user search partial email one ok', async () => {
        let users = await userModel.search("%so4@alibaba.com");
        expect(users[0]).to.deep.equal({
            id: 4,
            email: "jdoniso4@alibaba.com",
            balance: 261.93,
            active: true,
        });
        users = await userModel.search("bcroft7@qq.c%");
        expect(users[0]).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        });
        users = await userModel.search("%nind@statcounter.%");
        expect(users[0]).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
            balance: -128.53,
            active: true,
        });
    });
    it('user search partial email many ok', async () => {
        let users = await userModel.search("%ni%");

        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
        ]);
    });
    it('get all users pag offset 1, limit 2', async () => {
        const users = await userModel.allPag(1, 2)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            }
        ]);
    });
    it('get all users pag offset 1, limit 5 (db contains only 4 users)', async () => {
        const users = await userModel.allPag(1, 5)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 1, limit 3', async () => {
        const users = await userModel.allPag(1, 3)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 2, limit 3', async () => {
        const users = await userModel.allPag(2, 3)
        expect(users).to.deep.equal([
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 0, limit 2', async () => {
        const users = await userModel.allPag(0, 2)
        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
        ]);
    });

    it('update user status', async () => {
        let updated = await userModel.updStatus(5, true);
        expect(updated).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: true,
        });
        updated = await userModel.updStatus(5, false);
        expect(updated).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        });
    });

    it('update user email', async () => {
        const updated = await userModel.updEmail(5, "new@email.com");
        expect(updated).to.deep.equal({
            id: 5,
            email: "new@email.com",
            balance: -372.87,
            active: false,
        });
    });
    it('gets a user from DB (used in login), email ok)', async () => {
        const user = await userModel.getFromDB("afolonind@statcounter.com");
        expect(user).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
        });
    });

    it('gets a user from DB (used in login), email ok but inactive)', async () => {
        let user;
        try {
            user = await userModel.getFromDB("bcroft7@qq.com");
            throw new Error("Expected Error (The user does not exist)");
        } catch (error) {
            expect(error.message).to.include("The user does not exist");
        }
        expect(user).to.be.an.undefined;
    });

    it('gets a user from DB (used in login), email not ok)', async () => {
        try {
            const user = await userModel.getFromDB("julia@bth.se");
            throw new Error("Expected Error (The user does not exist)");
        } catch (error) {
            expect(error.message).to.include("The user does not exist");
        }
    });

    it('update user email, email missing', async () => {

        let updated;

        try {
            // try passing undefined instead of email
            updated = await userModel.updEmail(5, undefined);
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (email column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'email' cannot be null");
        }

        const notUpdated = await userModel.search(5);
        expect(notUpdated).to.deep.equal([{
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        }]);
    });

    // Add test for:

    //1. get token from github
    // 2. register
    // 3. login
    // 4. user serch one ok
    // 5. user seach one not ok
    // 6. 
});
