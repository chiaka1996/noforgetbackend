const router= require("express").Router();

const User_authentication= require("../controllers/user_authentication");

const addTodoPlans =  require('../controllers/add_plan')

// const tutor_authentication= require("./controllers/tutor_authentication");

router.post("/userProfile", User_authentication.user_registration);

router.post("/userLogin", User_authentication.userLogin);

router.post('/addplan', addTodoPlans.addPlan);

router.post("/getplans", addTodoPlans.getPlans);

router.post("/deleteplan", addTodoPlans.deletePlan);

router.post("/editplan", addTodoPlans.editPlan);

router.post("/updatestatus", addTodoPlans.updateStatus);

router.post("/changepassword",  User_authentication.changePassword);

router.post("/forgotpassword", User_authentication.forgotPassword);

router.post("/updateprofile", User_authentication.updateProfile);

module.exports= router;
