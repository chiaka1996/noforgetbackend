const mongoose= require("mongoose");

const Plan_profile= mongoose.Schema;

const plan_model =  new Plan_profile({
    plan: {type: String, required: true},
    planDate: {type: String, required: true},
},
{
    timestamps : true
});

const plan_registration_model = mongoose.model("plan_profile", plan_model);

module.exports = plan_registration_model;