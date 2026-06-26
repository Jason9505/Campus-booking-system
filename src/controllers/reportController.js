const reportService =
  require('../services/reportService');

const reportController = {

  async generateReport(req, res, next) {

    try {

      const report =
        await reportService.generate(
          req.query
        );

      res.json({
        success: true,
        data: report
      });

    } catch (err) {

      next(err);

    }

  },

  async exportPdf(req,res){

        await reportService.exportPdf(req,res);

    },

    async exportCsv(req, res, next) {

  try {

    await reportService.exportCsv(req, res);

  } catch (err) {

    next(err);

  }

},

  async getDepartments(req,res,next){

        try{

            const departments =
            await reportService.getDepartments();

            res.json({
                success:true,
                data:departments
            });

        }

        catch(err){

            next(err);

        }

    }

};

module.exports =
  reportController;