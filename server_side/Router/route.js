import { Router } from "express";
const router = Router();

/** IMPORT all the controllers */
import * as controller from '../controllers/appController.js'
import { registerMail } from "../controllers/mailer.js";
import Auth,{localVariable} from '../middleware/auth.js'



// post methods
router.route('/register').post(controller.register);//register method
// send email
router.route('/registerMail').post(registerMail);
// authenticate the user
// login in the app
router.route('/aurthenticate').post(controller.verifyUser,(req, res) => res.end()); 
// router.route('/aurthenticate').post(controller.verifyUser,controller.login); 
router.route('/login').post(controller.verifyUser,controller.login);
// Recuter post in app
router.route('/recuterpost').post(Auth,controller.recuterpost);

// Admin post in 
router.route('/Adminpost').post(Auth,controller.Adminpost);
// get the RecuterSourced Details  
router.route('/getRecuterSourcedDetails/:username').get(controller.getRecuterSourcedDetails);
// complaient router
router.route('/complaient').post(Auth,controller.Complaient);
//client post
router.route('/postClientDetails').post(controller.PostClientDetails);


// Get methods
router.route('/user/:email').get(controller.getuser); // user with username
router.route('/generateOTP').get(controller.verifyUser,localVariable,controller.generateOTP); // generate random otp
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route('/getUserDetails').get(Auth,controller.getUserDetails);//get the ticket number details
// Get user by id
router.route('/postuser/:id').get(controller.getUserById);
// GET method for fetching "Aroha Technologies" recruitments
router.route('/getArohaRecruitments').get(controller.getArohaRecruitments)
// GET the Admine Posted details
router.route('/getAdminPostClientRequirement').get(controller.getAdminPostClientRequirement)
router.route('/getAdminPostById/:id').get(controller.getAdminPostById)
router.route('/getRecruterPostDetailsById/:id').get(controller.getRecruterPostDetailsById)
// GET method to get count of candidates based on ticket number and status
router.route('/getCountByTicket/:Ticket_no').get(controller.getCountByTicket);
router.route('/getCountsForAllTickets').get(controller.getCountsForAllTickets);
//get all the admin post based on the status which as open,sourcing
router.route('/getAdminPostbyStatus').get(controller.getAdminPostbyStatus)

router.route('/getuserworkingprogress').get(controller.getuserworkingprogress)

// get all username
router.route('/getallUsername').get(controller.getAllUsernames)

//get all domains
router.route('/getAllDomains').get(controller.getAllDomains)
//get all the techstack
router.route('/getAllTechstack').get(controller.getAllTechstack)
// get all client details and search a cleitn
router.route('/getClients').get(controller.getClients)
// get only the client name
router.route('/getClientNames').get(controller.getClientNames)
// get client by id
router.route('/getClientById').get(controller.getClientById)



// put methods
router.route('/updateuser').put(Auth,controller.updateUser); // to update the user profile
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword); // use to reset password
router.route('/updateRecuterpostById/:id').put(Auth, controller.updateRecuterpostById); // update recruitment post by _id
router.route('/updateAdminpostById/:id').put(Auth, controller.updateAdminpostById); // update AdminpostById post by _id
router.route('/updateClient/:id').put(controller.updateClient); 


// delete
router.route('/deleteAdminpostById/:id').delete(Auth,controller.deleteAdminpostById); //delete  the admin post by id

export default router;