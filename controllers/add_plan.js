const Addplans = require("../models/plans");

exports.addPlan = (req, res) => {

    const { plan, planDate, email, status } = req.body;
    
    if(!plan) {
        res.status(201).json('plan cannot be empty')
    }
    else {
        const addedPlan = new Addplans({
            plan,
            planDate,
            email,
            status
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

//delete plan from the database
exports.deletePlan = (req, res) => {
    Addplans.deleteOne({_id: req.body._id})
    .then(
        () => {
            res.status(200).json('plan deleted')
        }
    ).catch((err) => res.status(400).json(err))
}

//editplan in the database
exports.editPlan = (req, res) => {
    const { _id, plan, planDate, email, status } = req.body;

    if(!plan) {
        res.status(201).json('plan cannot be empty')
    }
    else {
        const updateplan = new Addplans({
            _id,
            plan,
            planDate,
            email,
            status
        })

        Addplans.updateOne({_id: req.body._id}, updateplan)
        .then(() => {
            res.status(200).json('plan Edited successfully')

        }).catch((err) => res.status(400).json(err))
        
    }
}