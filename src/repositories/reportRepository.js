const reportService = require("../services/reportService");

const reportRepository = {
  async findAll(filters) {
    return await reportService.generate(filters);
  },

  async findFiltered(reportType, startDate, endDate, resourceType, department) {
    return await reportService.generate({
      reportType,
      startDate,
      endDate,
      resourceType,
      department,
    });
  },

  async getDepartments() {
    return await reportService.getDepartments();
  },
};

module.exports = reportRepository;
