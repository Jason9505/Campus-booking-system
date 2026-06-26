const db = require("../db");

const policyService = {

    async getPolicy() {

        return await db.queryOne(
            `
            SELECT *
            FROM bookingpolicy
            ORDER BY policyID DESC
            LIMIT 1
            `
        );

    },

    async updatePolicy(data) {

        await db.query(
            `
            UPDATE bookingpolicy
            SET

                maxAdvanceDays=?,
                minimumNotice=?,
                maximumDuration=?,
                cancellationDeadline=?

            WHERE policyID=1
            `,
            [

                data.maxAdvanceDays,
                data.minimumNotice,
                data.maximumDuration,
                data.cancellationDeadline

            ]
        );

        await db.insert(
            "policy_logs",
            {
                changedBy: data.changedBy || 1,
                description: "Booking policy updated."
            }
        );

    },

    async getLogs(){

        return await db.queryAll(`
            SELECT
                description,
                changedAt
            FROM policy_logs
            ORDER BY changedAt DESC
        `);

    },

};

module.exports = policyService;