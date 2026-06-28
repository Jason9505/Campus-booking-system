const resourceService = require('../services/resourceServices');

const resourceController = {

  async getAll(req, res, next) {
    try {

      const resources =
        await resourceService.getAllResources();

      res.json({
        success: true,
        data: resources
      });

    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {

      const resource =
        await resourceService.getResourceById(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      res.json({
        success: true,
        data: resource
      });

    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {

      const resourceID =
        await resourceService.createResource(
          req.body
        );

      res.status(201).json({
        success: true,
        message: 'Resource created',
        resourceID
      });

    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {

      await resourceService.updateResource(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        message: 'Resource updated'
      });

    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {

      await resourceService.deleteResource(
        req.params.id
      );

      res.json({
        success: true,
        message: 'Resource deleted'
      });

    } catch (err) {
      next(err);
    }
  },

  async searchResources(req, res, next) {

        try {

            const data =
                await resourceService.search(req.query);

            res.json({
                success: true,
                data
            });

        } catch (err) {

            next(err);

        }

    },

  async getFilterOptions(req, res, next) {

    try {

      const data =
        await resourceService.getFilterOptions();

      res.json({
        success: true,
        data
      });

    } catch (err) {

      next(err);

    }

  }

};

module.exports = resourceController;