const dashboardService =
require("../services/dashboardService");

const dashboardController = {

    async getDashboard(req,res,next){

        try{

            const data =
            await dashboardService.getDashboard(
                req.user
            );

            res.json({

                success:true,
                data

            });

        }

        catch(err){

            next(err);

        }

    }

};

module.exports =
dashboardController;