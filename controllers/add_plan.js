const Addplans = require("../models/plans");

exports.addPlan = (req, res) => {

    const { plan, planDate, email } = req.body;
    
    if(!plan) {
        res.status(201).json('plan cannot be empty')
    }
    else {
        const addedPlan = new Addplans({
            plan,
            planDate,
            email
        })

        addedPlan.save()
        .then(() => {
            res.status(200).json('plan added')
        })
        .catch((err) => res.status(400).json(err))
    }

}

//get specific user plans from the database
exports.getPlans = (req, res) => {
    Addplans.find({email: req.body.email})
    .then(
        (userPlans) => {
            res.status(200).json(userPlans);
        }
    ).catch((err) => res.status(400).json(err))
}
