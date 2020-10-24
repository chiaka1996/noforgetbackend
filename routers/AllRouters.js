const router= require("express").Router();

const student_authentication= require("../controllers/user_authentication");

const addTodoPlans =  require('../controllers/add_plan')

// const tutor_authentication= require("./controllers/tutor_authentication");

router.post("/userProfile", student_authentication.user_registration);

router.post("/userLogin", student_authentication.userLogin);

router.post('/addplan', addTodoPlans.addPlan);

module.exports= router;
