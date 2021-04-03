const getplans = require("../models/plans");
const nodemailer = require('nodemailer');


exports.cronJobs = () => {
    let date = new Date();
    let getMonth = date.getMonth() + 1;
    let getYear = date.getFullYear();
    let getDate = date.getDate();

   getplans.find().then((response) => {
    response.map((result) => { 
        let planDate = result.planDate;
        let year = planDate.slice(0,4);
        let month = planDate.slice(5,7);
        let day = planDate.slice(8, 10);
        let reminderDate = day-1;
        let planEmail = result.email;
        let plan = result.plan;

        if( getYear==year && getMonth==month && getDate==reminderDate){
            let transporter = nodemailer.createTransport({
                host: 'smtp.zoho.com',
                port: 587,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
              })
      
              var mailOptions = {
                from: 'chiakajunior@zohomail.com',
                to: planEmail,
                subject: "REMINDER FROM NOFORGET APP" ,
                text: `Good day, this is to remind you that your plan:${plan} is coming up tomorrow. THANKS.`
              }

              transporter.sendMail(mailOptions, (error, data) =>  data)
      
        }
    });
   })
}