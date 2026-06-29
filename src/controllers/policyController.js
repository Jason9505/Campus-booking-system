const policyService = require("../services/policyService");

const policyController = {

    async get(req,res,next){

        try{

            const policy =
                await policyService.getPolicy();

            res.json({

                success:true,
                data:policy

            });

        }

        catch(err){

            next(err);

        }

    },

    async logs(req,res,next){

        try{

            const logs =
                await policyService.getLogs();

            res.json({
                success:true,
                data:logs
            });

        }

        catch(err){

            next(err);

        }

    },

    async update(req,res,next){

        try{

            await policyService.updatePolicy(req.body, req.user.id);

            res.json({

                success:true,
                message:"Policy updated."

            });

        }

        catch(err){

            next(err);

        }

    }

};

module.exports = policyController;