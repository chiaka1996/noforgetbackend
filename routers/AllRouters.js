const router= require("express").Router();

const student_authentication= require("../controllers/user_authentication");

// const tutor_authentication= require("./controllers/tutor_authentication");

router.post("/userProfile", student_authentication.user_registration);

router.post("/userLogin", student_authentication.userLogin);

// router.post("/tutor_profile", tutor_authentication.tutor_signup);

// router.post("/tutor_login", tutor_authentication.tutorLogin);

module.exports= router;

