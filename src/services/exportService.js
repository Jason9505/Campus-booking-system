const reportService = require("./reportService");

const exportService = {
  async exportPdf(req, res) {
    await reportService.exportPdf(req, res);
  },

  async exportCsv(req, res) {
    await reportService.exportCsv(req, res);
  },
};

module.exports = exportService;
