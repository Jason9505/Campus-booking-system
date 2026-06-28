const db = require('../db');

const resourceService = {

  async getAllResources() {
    return await db.queryAll(
      'SELECT * FROM resources ORDER BY resourceID DESC'
    );
  },

  async getResourceById(id) {
    return await db.queryOne(
      'SELECT * FROM resources WHERE resourceID = ?',
      [id]
    );
  },

  async createResource(data) {

    const resourceID = await db.insert('resources', {
      name: data.name,
      type: data.type,
      location: data.location || null,
      capacity: data.capacity || null,
      status: data.status || 'Available'
    });

    return resourceID;
  },

  async updateResource(id, data) {

    await db.update(
      'resources',
      {
        name: data.name,
        type: data.type,
        location: data.location,
        capacity: data.capacity,
        status: data.status
      },
      'resourceID',
      id
    );

    return true;
  },

  async deleteResource(id) {

    await db.remove(
      'resources',
      'resourceID',
      id
    );

    return true;
  },

  async getFilterOptions() {
    const types = await db.queryAll(
      'SELECT DISTINCT type FROM resources WHERE type IS NOT NULL ORDER BY type'
    );
    const locations = await db.queryAll(
      'SELECT DISTINCT location FROM resources WHERE location IS NOT NULL ORDER BY location'
    );
    return {
      types: types.map(r => r.type),
      locations: locations.map(r => r.location)
    };
  },

  async search(filters){

      let sql = `
          SELECT
              r.*,

              CASE

                  WHEN EXISTS(

                      SELECT 1

                      FROM bookings b

                      WHERE b.resourceID = r.resourceID

                      AND DATE(b.startDateTime)=?

                      AND TIME(b.startDateTime)=?

                      AND b.status IN ('Pending','Confirmed')

                  )

                  THEN 'Booked'

                  ELSE 'Available'

              END availability

          FROM resources r

          WHERE 1=1
      `;

      const params = [

          filters.date,

          filters.time

      ];

      if(filters.type){

          sql += " AND r.type=?";

          params.push(filters.type);

      }

      if(filters.location){

          sql += " AND r.location LIKE ?";

          params.push(`%${filters.location}%`);

      }

      if(filters.capacity){

          sql += " AND r.capacity>=?";

          params.push(filters.capacity);

      }

      return await db.queryAll(sql, params);

  }

};

module.exports = resourceService;