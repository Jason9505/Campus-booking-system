const db = require("../db");

const dashboardService = {

    async getDashboard(user){

        const role = user.role;

        //------------------------------------------------
        // STUDENT & STAFF
        //------------------------------------------------

        if(role==="Student" || role==="FacultyStaff"){

            const upcoming =
            await db.queryOne(
            `
            SELECT COUNT(*) total
            FROM bookings
            WHERE userID=?
            AND startDateTime>=NOW()
            `,
            [user.id]
            );

            const pending =
            await db.queryOne(
            `
            SELECT COUNT(*) total
            FROM bookings
            WHERE userID=?
            AND status='Pending'
            `,
            [user.id]
            );

            const available =
            await db.queryOne(
            `
            SELECT COUNT(*) total
            FROM resources
            WHERE status='Available'
            `
            );

            return{

                upcomingBookings:
                upcoming.total,

                pendingApproval:
                pending.total,

                availableResources:
                available.total

            };

        }

        //------------------------------------------------
        // ADMIN
        //------------------------------------------------

        const totalBookings =
        await db.queryOne(
        `
        SELECT COUNT(*) total
        FROM bookings
        `
        );

        const activeUsers =
        await db.queryOne(
        `
        SELECT COUNT(*) total
        FROM users
        WHERE isActive=1
        `
        );

        const pending =
        await db.queryOne(
        `
        SELECT COUNT(*) total
        FROM bookings
        WHERE status='Pending'
        `
        );

        const resources =
        await db.queryOne(
        `
        SELECT COUNT(*) total
        FROM resources
        `
        );

        //------------------------------------------------
        // Administrative Summary
        //------------------------------------------------

        const mostUsed =
        await db.queryOne(
        `
        SELECT
            r.name,
            COUNT(*) total
        FROM bookings b
        JOIN resources r
        ON b.resourceID=r.resourceID
        GROUP BY r.resourceID
        ORDER BY total DESC
        LIMIT 1
        `
        );

        const peakDay =
        await db.queryOne(
        `
        SELECT
        DAYNAME(startDateTime) dayName,
        COUNT(*) total
        FROM bookings
        GROUP BY DAYNAME(startDateTime)
        ORDER BY total DESC
        LIMIT 1
        `
        );

        return{

            totalBookings:
            totalBookings.total,

            activeUsers:
            activeUsers.total,

            pendingRequests:
            pending.total,

            resources:
            resources.total,

            mostUsed:
            mostUsed?.name || "-",

            peakDay:
            peakDay?.dayName || "-"

        };

    }

};

module.exports =
dashboardService;