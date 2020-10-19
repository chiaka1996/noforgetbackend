const mongoose= require("mongoose");

const Student_profile= mongoose.Schema;

const user_model =  new Student_profile({
    email: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
},
{
    timestamps : true
});

const user_registration_model = mongoose.model("user_profile", user_model);

module.exports = user_registration_model;