const db = require('../db');

const PDFDocument = require("pdfkit");

function drawTableHeader(doc, y, headers){

    doc
        .fillColor("#0B5ED7")
        .rect(50, y, 500, 25)
        .fill();

    doc.fillColor("white")
       .font("Helvetica-Bold")
       .fontSize(11);

    headers.forEach((header,index)=>{

        doc.text(
            header,
            60 + (index*220),
            y+7
        );

    });

}

function drawTableRow(doc,y,values,alternate=false){

    if(alternate){

        doc.save();

        doc.fillColor("#F5F5F5")
           .rect(50,y,500,25)
           .fill();

        doc.restore();

    }

    doc.fillColor("black")
       .font("Helvetica")
       .fontSize(10);

    values.forEach((value,index)=>{

        doc.text(
            String(value),
            60+(index*220),
            y+7
        );

    });

}

const reportService = {

    async getDepartments(){

        return await db.queryAll(
        `
        SELECT DISTINCT department
        FROM users
        WHERE department IS NOT NULL
        ORDER BY department
        `
        );

    },

  async generate(filters) {

    const {
      reportType,
      startDate,
      endDate,
      resourceType,
      department
    } = filters;

    let where = " WHERE 1=1 ";
    let params = [];

    if(startDate){

        where += " AND DATE(b.startDateTime) >= ? ";
        params.push(startDate);

    }

    if(endDate){

        where += " AND DATE(b.startDateTime) <= ? ";
        params.push(endDate);

    }

    if(resourceType){

        where += " AND r.type = ? ";
        params.push(resourceType);

    }

    if(department){

        where += " AND u.department = ? ";
        params.push(department);

    }

    switch(reportType){

      case "trends":

        return await db.queryAll(
            `
            SELECT
            DATE(b.startDateTime) AS bookingDate,
            COUNT(*) AS totalBookings

            FROM bookings b

            JOIN resources r
            ON b.resourceID=r.resourceID

            JOIN users u
            ON b.userID=u.userID

            ${where}

            GROUP BY DATE(b.startDateTime)

            ORDER BY bookingDate
            `,
            params
            );

      case "heatmap":

        return await db.queryAll(
            `
            SELECT
            r.name,
            COUNT(*) AS totalBookings
            FROM bookings b

            JOIN resources r
            ON b.resourceID = r.resourceID

            JOIN users u
            ON b.userID = u.userID

            ${where}

            GROUP BY r.resourceID
            ORDER BY totalBookings DESC
            `,
            params
            );

      case "summary":

        return await db.queryAll(
            `
            SELECT
            b.status,
            COUNT(*) total

            FROM bookings b

            JOIN resources r
            ON b.resourceID=r.resourceID

            JOIN users u
            ON b.userID=u.userID

            ${where}

            GROUP BY b.status
            `,
            params
            );

      default:
        return [];

    }

  },

  async exportPdf(req,res){

    const filters = req.query;

    const data =
        await this.generate(filters);

    const doc =
        new PDFDocument({
            margin:50,
            size:"A4"
        });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    //------------------------------------------------
    // TITLE
    //------------------------------------------------

    doc
        .fontSize(22)
        .fillColor("#0B5ED7")
        .text(
            "Campus Resource Booking System",
            {
                align:"center"
            }
        );

    doc.moveDown(0.5);

    doc
        .fontSize(16)
        .fillColor("black")
        .text(
            "Report",
            {
                align:"center"
            }
        );

    doc.moveDown();

    //------------------------------------------------
    // INFORMATION
    //------------------------------------------------

    doc.fontSize(11);

    doc.text(
        `Prepared on : ${new Date().toLocaleString()}`
    );

    doc.text(
        `Report Type : ${filters.reportType}`
    );

    doc.text(
        `Date Range : ${filters.startDate || "-"}  to  ${filters.endDate || "-"}`
    );

    doc.moveDown(2);

    //------------------------------------------------
    // TABLE
    //------------------------------------------------

    let headers=[];

    if(filters.reportType==="heatmap"){

        headers=[
            "Resource",
            "Bookings"
        ];

    }

    else if(filters.reportType==="trends"){

        headers=[
            "Date",
            "Bookings"
        ];

    }

    else{

        headers=[
            "Status",
            "Total"
        ];

    }

    let y=190;

    drawTableHeader(
        doc,
        y,
        headers
    );

    y+=25;

    data.forEach((row,index)=>{

        let values=[];

        if(filters.reportType==="heatmap"){

            values=[
                row.name,
                row.totalBookings
            ];

        }

        else if(filters.reportType==="trends"){

            values=[
                row.bookingDate,
                row.totalBookings
            ];

        }

        else{

            values=[
                row.status,
                row.total
            ];

        }

        drawTableRow(
            doc,
            y,
            values,
            index%2===0
        );

        y+=25;

    });

    //------------------------------------------------
    // TOTAL
    //------------------------------------------------

    doc.moveDown(2);

    doc.font("Helvetica-Bold");

    doc.text(
        `Total Records : ${data.length}`
    );

    //------------------------------------------------
    // FOOTER
    //------------------------------------------------

    doc.fontSize(9);

    doc.fillColor("gray");

    doc.text(

        "Generated automatically by Campus Resource Booking System",

        50,

        760,

        {

            align:"center"

        }

    );

    //------------------------------------------------
    // PAGE NUMBER
    //------------------------------------------------

    doc.text(

        "Page 1",

        500,

        760

    );

    doc.end();

},

  /////////////////////

  async exportCsv(req, res) {

    const data = await this.generate(req.query);

    if (data.length === 0) {

      return res.status(404).send("No data");

    }

    // Get column names
    const headers = Object.keys(data[0]);

    let csv = headers.join(",") + "\n";

    data.forEach(row => {

      csv += headers
        .map(h => `"${row[h] ?? ""}"`)
        .join(",");

      csv += "\n";

    });

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.csv"
    );

    res.send(csv);

  }

};

module.exports = reportService;