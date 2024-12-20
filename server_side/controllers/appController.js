import UserModel from "../model/User.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../Router/config.js";
import otpGenerator from "otp-generator";
import RecuteModule from "../model/Recute.module.js";
import AdminModule from "../model/Admin.module.js";
import DeveloperModel from "../model/Developer.model.js";
import transporter from "../controllers/mailer.js";
import moment from "moment-timezone";
import { Types } from "mongoose";
import clientSchema from "../model/Client.module.js";
import mongoose from "mongoose";

/** middleware for verify user */
// export async function verifyUser(req, res, next){
//     try {
//       console.log('Controller verfiyUser: ', req.body)
//         const { username } = req.method === "GET" ? req.query : req.body;

//         console.log('Data from Frontend: ', {username, email})
//         // Check the user existence
//         const user = await UserModel.findOne({ username });
//         if (!user) {
//           return res.status(404).send({ error: "User not found" });
//         }

//         // Attach the user object to the request for further use
//         req.user = user;
//         next();
//       } catch (error) {
//         return res.status(500).send({ error: "Authentication Error" });
//       }
// }

// ** middleware for verifying User with Username or Email **
// export async function verifyUser(req, res, next) {
//   try {
//     console.log("Controller verifyUser: ", req.body);
//     const { username, email } = req.method === "GET" ? req.query : req.body;
//     console.log("Data from Frontend: ", { username, email });

//     if (username && !email) {
//       console.log("Username is Present");
//       // Check the user existence
//       const user = await UserModel.findOne({ username });
//       if (!user) {
//         return res.status(404).send({ error: "User not found" });
//       }

//       // Attach the user object to the request for further use
//       req.user = user;
//       next();
//     } else if (!username && email) {
//       console.log("Email is Present: ", email);
//       // Check the user existence
//       const userByEmail = await UserModel.findOne({ email }); // Use a new variable
//       console.log("Data: ", userByEmail);
//       if (!userByEmail) {
//         console.log("There is no Data for this Email");
//         return res.status(404).send({ error: "User not found" });
//       }

//       // Attach the user object to the request for further use
//       req.user = userByEmail;
//       next();
//     } else {
//       return res.status(400).send({ error: "Invalid request data" });
//     }
//   } catch (error) {
//     // console.error("Error in verifyUser:", error);
//     return res.status(500).send({ error: "Authentication Error" });
//   }
// }

export async function verifyUser(req, res, next) {
  try {
    console.log("Controller verifyUser: ", req.body);
    const { username, email } = req.method === "GET" ? req.query : req.body;
    console.log("Data from Frontend: ", { username, email });

    // Input validation
    if (!username && !email) {
      return res.status(400).send({ error: "Username or email is required" });
    }

    // Determine the query based on available input
    const query = username ? { username } : { email };

    // Find the user
    const user = await UserModel.findOne(query);
    if (!user) {
      console.log("User not found");
      return res.status(404).send({ error: "User not found" });
    }

    // Attach the user object to the request for further use
    req.user = user;
    console.log(" request user: ", req.user);
    next();
  } catch (error) {
    console.error("Error in verifyUser:", error); // Log the error for debugging
    return res.status(500).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8000/api/register 
 * http://localhost:8765/api/login
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email, position } = req.body;

    // check the existing user
    const existUsername = UserModel.findOne({ username }).exec();
    const existEmail = UserModel.findOne({ email }).exec();

    Promise.all([existUsername, existEmail])
      .then(([existingUsername, existingEmail]) => {
        if (existingUsername) {
          return res
            .status(400)
            .send({ error: "Please use a unique username" });
        }
        if (existingEmail) {
          return res.status(400).send({ error: "Please use a unique email" });
        }
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
                position,
              });

              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User registered successfully" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).send({ error: "Unable to hash password" });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

// //**
// http://localhost:8765/api/recuterpost
// * @param {
//   "Ticket_no":1,
//   "CandidateName":"abineshwaran",
//   "MobileNumber":9710087209,
//   "Yre_of_exp":3,
//   "Domine":"mechanical"
// } */
export async function recuterpost(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const {
      Ticket_no,
      CandidateName,
      MobileNumber,
      Email,
      Yre_of_expe,
      Relevent_Yre_of_exp,
      Domain,
      CTC,
      ECTC,
      Current_location,
      Preffered_location,
      Reason_for_change,
      Notice_peried,
      Comment,
      Referral,
      Referral_MobileNumber,
      Status,
      Current_Company,
      Client_feedback,
      Upload_resume,
      date,
      Availability,
      Serving_Notice_Period_Date,
      current_offer,
      offer_details,
    } = req.body;
    // Check if a candidate with the same Email or MobileNumber already exists for the given Ticket_no
    const existingCandidate = await RecuteModule.findOne({
      $and: [{ $or: [{ Email }, { MobileNumber }] }],
    });

    if (existingCandidate) {
      return res.status(409).json({
        error: "Candidate with the same Email or MobileNumber already exists",
      });
    }
    // Fetch the user based on the userId from req.user
    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the username from the user object
    const username = user.username;

    const recuteData = {
      Ticket_no,
      CandidateName,
      MobileNumber,
      Email,
      Yre_of_expe,
      Relevent_Yre_of_exp,
      Domain,
      CTC,
      ECTC,
      Current_location,
      Preffered_location,
      Reason_for_change,
      Notice_peried,
      Comment,
      Status,
      Current_Company,
      Referral,
      Referral_MobileNumber,
      Client_feedback,
      Upload_resume,
      date,
      Availability,
      Serving_Notice_Period_Date,
      username, // Add the username to the recuteData object
      current_offer,
      offer_details,
    };

    // Create a new RecuteModule document with the username included
    const recuteModule = new RecuteModule(recuteData);

    // Save the RecuteModule document to the database
    await recuteModule.save();

    res.status(201).send({ msg: "Recuter posted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// http://localhost:8765/api/Adminpost
//post data of admin in thunderclient
// * @param {
//   "Ticket_no": "T12345",
//   "Client_Name": "Example Client",
//   "Open_position": "Software Engineer",
//   "Yre_of_exp": "3",
//   "Tech_stack": "JavaScript, Node.js",
//   "Budget": "$80000",
//   "Location": "New York",
//   "status": "Open",
//   "Job_Description": "This is a job description.",
//   "Mode": "Full-Time"
//} */
export async function Adminpost(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const {
      Ticket_no,
      Client_Name,
      Open_position,
      min_Yre_of_exp,
      max_Yre_of_exp,
      Tech_stack,
      Budget,
      Location,
      status,
      Job_Description,
      Job_Des,
      Job_Mode,
      Mode,
      Notice_peried,
      Serving_Notice_Period_Date,
    } = req.body;

    // Extract the username from the user object
    const username = req.user.username; // Fixed the issue with user object access

    const recuteData = {
      Ticket_no,
      Client_Name,
      Open_position,
      min_Yre_of_exp,
      max_Yre_of_exp,
      Tech_stack,
      Budget,
      Location,
      status,
      Job_Description,
      Job_Des,
      Mode,
      Job_Mode,
      PostedUser: username,
      Notice_peried,
      Serving_Notice_Period_Date, // Add the username to the recuteData object
    };

    // Create a new AdminModule document with the username included
    const adminModule = new AdminModule(recuteData);

    // Save the AdminModule document to the database CHENNAIAroha@gmail.com,Hr@aroha.co.in
    adminModule
      .save()
      .then((result) => {
        const email = {
          from: "arohatechnologies0@gmail.com",
          to: "Hr@aroha.co.in",
          subject: "new requirement posted",
          html: `
            <style>
              h2 {
                font-size: 10px;
                font-family: 'Times New Roman', Times, serif;
              }
            </style>
            <h2>Hi All,<br>Please find the below new requirement.</h2>
            <h2>Posted By: ${result.PostedUser}</h2>
            <h2>Ticket No: ${result.Ticket_no}</h2>
            <h2>Client Name: ${result.Client_Name}</h2>
            <h2>Open Position: ${result.Open_position}</h2>
            <h2>Min Year of Experience: ${result.min_Yre_of_exp
              .map((stack) => stack.value)
              .join(", ")}</h2>
            <h2>Max Year of Experience: ${result.max_Yre_of_exp
              .map((stack) => stack.value)
              .join(", ")}</h2>
            <h2>Tech Stack: ${result.Tech_stack.map(
              (stack) => stack.value
            ).join(", ")}</h2>
            <h2>Budget in lakhs: ${result.Budget}</h2>
            <h2>Location: ${result.Location.map(
              (Location) => Location.value
            )}</h2>
            <h2>Working Mode: ${result.Mode.map((Mode) => Mode.value).join(
              ", "
            )}</h2>
            <h2>Job Mode: ${result.Job_Mode.map((Mode) => Mode.value).join(
              ", "
            )}</h2>
          `,
        };

        // Send the email using the transporter from the imported file
        transporter.sendMail(email, (err, info) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ error: "Failed to send email" });
          } else {
            console.log("Email sent: " + info.response);
            res
              .status(201)
              .send({ msg: "Admin posted successfully", adminModule: result });
          }
        });
      })
      .catch((error) => res.status(500).send({ error }));
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

//update recute post by the means of _id
//http://localhost:8765/api/updateRecuterpostById/:id
export async function updateRecuterpostById(req, res) {
  try {
    const { userId } = req.user;

    // Check for authentication and user existence
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const postId = req.params.id;

    const {
      MobileNumber, // Move MobileNumber to the top for consistency
      ...updatedData // Store the rest of the data in a separate object
    } = req.body;

    // Validate that postId is a valid ObjectId
    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Check if the new mobile number or email already exists within the same ticket number
    const existingRecuterpost = await RecuteModule.findOne({
      Ticket_no: updatedData.Ticket_no,
      $or: [
        { Email: updatedData.Email },
        { MobileNumber: updatedData.MobileNumber },
      ],
      _id: { $ne: postId },
    });

    if (existingRecuterpost) {
      return res.status(409).json({
        error:
          "A record with the same Ticket_no, email, or mobile number already exists.",
      });
    }

    // Fetch the user and their username
    const user = await UserModel.findById(userId);
    const username = user?.username;

    // Update the recruitment post
    const updatedRecuterpost = await RecuteModule.findByIdAndUpdate(
      postId,
      {
        ...updatedData,
        MobileNumber, // Include the new mobile number in the update operation
        lastupdate: username,
      },
      { new: true }
    );

    if (!updatedRecuterpost) {
      return res.status(404).json({ error: "Recruitment post not found" });
    }

    return res.status(200).json({
      msg: "Recruitment post updated successfully",
      data: updatedRecuterpost,
    });
  } catch (error) {
    console.error("Error updating recruiter post:", error);
    return res.status(500).json({ error: "Failed to update recruitment post" });
  }
}

// http://localhost:8765/api/deleteAdminpostById/:id
export async function deleteAdminpostById(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const postId = req.params.id; // Assuming the route parameter is named "id"

    // Perform the deletion
    const deletedAdminpost = await AdminModule.findByIdAndDelete(postId);

    if (!deletedAdminpost) {
      return res.status(404).json({ error: "Recruitment post not found" });
    }

    // Return a success message
    return res
      .status(200)
      .json({ msg: "Recruitment post deleted successfully", deletedAdminpost });
  } catch (error) {
    console.error("Error deleting recruiter post:", error);
    return res.status(500).json({ error: "Failed to delete recruitment post" });
  }
}

// http://localhost:8765/api/updateAdminpostById/:id
export async function updateAdminpostById(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const postId = req.params.id; // Assuming the route parameter is named "id"
    console.log("Post ID from request params:", postId);

    const {
      Ticket_no,
      Client_Name,
      Open_position,
      min_Yre_of_exp,
      max_Yre_of_exp,
      Tech_stack,
      Budget,
      Location,
      status,
      Job_Description,
      Job_Des,
      Job_Mode,
      Mode, // Extract the new mobile number from req.body
    } = req.body;

    // Fetch the user based on the userId from req.user
    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the username from the user object
    const username = user.username;

    // Fetch the existing document
    const existingAdminpost = await AdminModule.findById(postId);

    if (!existingAdminpost) {
      return res.status(404).json({ error: "Recruitment post not found" });
    }

    // Determine if the status is changing
    const isStatusChanging = existingAdminpost.status !== status;

    // Construct the updateData object
    const updateData = {
      Ticket_no,
      Client_Name,
      Open_position,
      min_Yre_of_exp,
      max_Yre_of_exp,
      Tech_stack, // Updated directly
      Budget,
      Location,
      status,
      Job_Description,
      Job_Des,
      Mode,
      Job_Mode,
      userupdate: {
        lastupdate: username,
      },
    };

    if (isStatusChanging) {
      updateData.date = new Date(); // Update the 'date' field with the current date
    } else {
      updateData.date = existingAdminpost.date; // Keep the existing date
    }

    const updatedAdminpost = await AdminModule.findByIdAndUpdate(
      postId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedAdminpost) {
      return res.status(404).json({ error: "Recruitment post not found" });
    }

    return res.status(200).json({
      msg: "Recruitment post updated successfully",
      data: updatedAdminpost,
    });
  } catch (error) {
    console.error("Error updating recruiter post:", error);
    return res.status(500).json({ error: "Failed to update recruitment post" });
  }
}

/** POST: http://localhost:8765/api/login 
 * @param: { 
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  console.log("Login function: ", req.body);
  const { email, password } = req.body;

  try {
    UserModel.findOne({ email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Incorrect password" });

            // Create JWT token
            const token = jwt.sign(
              { userId: user._id, username: user.username },
              config.JWT_SECRET,
              { expiresIn: "24h" }
            );

            // Get the current IST time in Chennai and format it in 12-hour format
            const loginTimeIST = moment
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DD hh:mm:ss A"); // 12-hour format

            UserModel.findByIdAndUpdate(
              user._id,
              { $set: { loginTime: loginTimeIST } },
              { new: true }
            ).exec();

            return res.status(200).send({
              msg: "Login Successful",
              email: user.email,
              loginTimeIST,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
/** GET: http://localhost:8765/api/user/example123 */
export async function getuser(req, res) {
  console.log("Function is Called....");
  const { email } = req.params;
  console.log("Front data: ", req.params);

  try {
    if (!email) {
      return res.status(400).send({ error: "Invalid username" });
    }

    const user = await UserModel.findOne({ email }, "-password");

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

// GET method for fetching user details based on any one of the details
// http://localhost:8765/api/postuser/:id
export async function getUserDetails(req, res) {
  const {
    Ticket_no,
    CandidateName,
    MobileNumber,
    Domain,
    Notice_peried,
    minECTC,
    maxECTC,
    fromDate,
    toDate,
    minYre,
    maxYre,
  } = req.query;

  try {
    // Create a query object to filter records based on user input
    const query = {};

    if (Ticket_no) {
      query.Ticket_no = Ticket_no;
    }

    if (MobileNumber) {
      query.MobileNumber = MobileNumber;
    }

    // Check if the client name provided and add it to the query (case-insensitive)
    if (CandidateName) {
      query.CandidateName = { $regex: new RegExp(CandidateName, "i") };
    }

    // Check if the Domain is provided and add it to the query (case-insensitive and ignoring spaces)
    if (Domain && Domain.length > 0) {
      // Extract values from the array of objects and create regex patterns to ignore case and spaces
      const domainRegexes = Domain.map((item) => {
        const pattern = item.value.replace(/\s+/g, "").toLowerCase(); // Remove spaces and convert to lowercase
        return new RegExp(pattern, "i"); // Create a case-insensitive regex
      });

      // Use $elemMatch to find documents where at least one element in the "Domain" array matches any regex pattern
      query.Domain = {
        $elemMatch: {
          value: {
            $in: domainRegexes,
          },
        },
      };
    }

    if (Notice_peried) {
      query.Notice_peried = { $regex: new RegExp(Notice_peried, "i") };
    }

    // Check if minYre and maxYre provided and add them to the query
    if (minYre && maxYre) {
      query.Yre_of_expe = {
        $elemMatch: {
          value: { $gte: parseInt(minYre), $lte: parseInt(maxYre) },
        },
      };
    } else if (minYre) {
      query.Yre_of_expe = { $elemMatch: { value: { $gte: parseInt(minYre) } } };
    } else if (maxYre) {
      query.Yre_of_expe = { $elemMatch: { value: { $lte: parseInt(maxYre) } } };
    }

    // Check if fromDate and toDate provided and add them to the query
    if (fromDate && toDate) {
      // Set time to the end of the day for toDate
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59);

      query.date = { $gte: new Date(fromDate), $lte: endDate };
    } else if (fromDate) {
      query.date = { $gte: new Date(fromDate) };
    } else if (toDate) {
      // Set time to the end of the day for toDate
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59);

      query.date = { $lte: endDate };
    }

    // Check if minECTC and maxECTC provided and add them to the query
    if (minECTC && maxECTC) {
      query.ECTC = { $gte: parseFloat(minECTC), $lte: parseFloat(maxECTC) };
    } else if (minECTC) {
      query.ECTC = { $gte: parseFloat(minECTC) };
    } else if (maxECTC) {
      query.ECTC = { $lte: parseFloat(maxECTC) };
    }

    // If no query parameters provided, fetch all records excluding Upload_resume
    const users = await (Object.keys(query).length
      ? RecuteModule.find(query).select("-Upload_resume")
      : RecuteModule.find().select("-Upload_resume"));

    // Return the found users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// get all the admin post
// http://localhost:8765/api/getAdminPostClientRequirement
export async function getAdminPostClientRequirement(req, res) {
  const { Ticket_no, Client_Name, status, fromDate, toDate } = req.query;

  try {
    // Create a query object to filter records based on user input
    const query = {};

    // Check if the user provided Ticket_no and add it to the query
    if (Ticket_no) {
      query.Ticket_no = Ticket_no;
    }

    // Check if the client name provided and add it to the query (case-insensitive)
    if (Client_Name) {
      query.Client_Name = { $regex: new RegExp(Client_Name, "i") };
    }

    // Check if the status provided and add it to the query (case-insensitive)
    if (status) {
      query.status = { $regex: new RegExp(status, "i") };
    }

    // Check if fromDate and toDate provided and add them to the query
    if (fromDate && toDate) {
      // Set time to the end of the day for toDate
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59);

      query.date = { $gte: new Date(fromDate), $lte: endDate };
    } else if (fromDate) {
      query.date = { $gte: new Date(fromDate) };
    } else if (toDate) {
      // Set time to the end of the day for toDate
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59);

      query.date = { $lte: endDate };
    }

    // If no query parameters provided, fetch all records
    const users = await (Object.keys(query).length
      ? AdminModule.find(query)
      : AdminModule.find());

    // Return the found users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//get all the admin post based on the status which as open,sourcing
// http://localhost:8765/api/getAdminPostbyStatus
export async function getAdminPostbyStatus(req, res) {
  try {
    const query = {
      status: { $regex: /open|Interviewing|sourcing/i },
    };
    const fieldsToInclude =
      "Ticket_no Client_Name Tech_stack Location status date";
    const jobs = await AdminModule.find(query).select(fieldsToInclude);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}
// get recuter post details by id
// http://localhost:8765/api/postuser/:id
export async function getUserById(req, res) {
  try {
    const userId = req.params.id;

    // Ensure that userId is valid and not undefined
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Fetch the user based on the provided userId
    const user = await RecuteModule.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
}
// get admin details by id
// http://localhost:8765/api/getAdminPostById/:id
export async function getAdminPostById(req, res) {
  try {
    const userId = req.params.id;

    // Ensure that userId is valid and not undefined
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Fetch the user based on the provided userId
    const user = await AdminModule.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
}

// get Recruter post details by id
// http://localhost:8765/api/getRecruterPostDetailsById/:id
export async function getRecruterPostDetailsById(req, res) {
  try {
    const userId = req.params.id;

    // Ensure that userId is valid and not undefined
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Fetch the user based on the provided userId
    const user = await RecuteModule.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
}
// GET method for fetching recruitment posts with Current_Company as "Aroha Technologies"
// http://localhost:8765/api/getArohaRecruitments
// Function to get Aroha Technologies recruitments
export async function getArohaRecruitments(req, res) {
  try {
    // Using a case-insensitive regex to match "Aroha Technologies" in any case
    const criteria = {
      Current_Company: { $regex: "aroHa tEchNologies", $options: "i" },
    };

    // Fetch only necessary fields and limit the number of documents
    const posts = await RecuteModule.find(criteria, {
      _id: 0 /* other fields you need */,
    }).limit(50);

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No recruitment posts found for Aroha Technologies" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching Aroha Technologies recruitments:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch Aroha Technologies recruitments" });
  }
}
/** PUT: http://localhost:8765/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
//http://localhost:8765/api/getRecuterSourcedDetails/:username
export async function getRecuterSourcedDetails(req, res) {
  const { username } = req.params;
  const { fromDate, toDate } = req.query;

  try {
    const query = { username };

    // Check if both fromDate and toDate are provided
    if (fromDate && toDate) {
      // Set time to the start of the day for fromDate
      const startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0);

      // Set time to the end of the day for toDate
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59);

      // Add both username and date range to the query
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // If no date range is provided, just add the username to the query
      query.date = { $exists: true };
    }

    const usersWithUsernameAndDate = await RecuteModule.find(query);

    // Initialize status counts with 0 for all statuses, including "remaining"
    const statusCounts = {
      "Yet to Receive feedback": 0,
      "Selected By Client": 0,
      "Rejected By Aroha": 0,
      "Rejected By Client": 0,
      remaining: 0,
    };

    // If records are found, populate the status counts
    if (usersWithUsernameAndDate && usersWithUsernameAndDate.length > 0) {
      usersWithUsernameAndDate.forEach((user) => {
        const status = user.Status || "remaining"; // Use 'remaining' for empty or undefined statuses
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
    }

    const totalCandidates = usersWithUsernameAndDate.length;

    const result = {
      username,
      totalCandidates,
      statusCounts,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// user updates
//http://localhost:8765/api/updateuser
export async function updateUser(req, res) {
  try {
    const { username, firstName, lastName, address, profile, email, mobile } =
      req.body;
    const { userId } = req.user; // Extract the user ID from the JWT token

    UserModel.findByIdAndUpdate(
      userId,
      { username, firstName, lastName, address, profile, email, mobile },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send({ error: "User not found" });
        }

        return res
          .status(200)
          .send({ msg: "Record updated successfully", user: updatedUser });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Failed to update user" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

// update recute post

/** GET: http://localhost:8765/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log("Generate otp: ", { code: req.app.locals.OTP });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8765/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8765/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "session expired" });
}

// update the password when we have valid session
/** PUT: http://localhost:8765/api/resetPassword */
export async function resetPassword(req, res) {
  console.log("........Hi this is ResetPassword........", req.body);
  try {
    // if (!req.app.locals.resetSession)
    //   return res.status(440).send({ error: "session expired" });
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).send({ error: "User Email not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.updateOne(
        { username: user.username },
        { password: hashedPassword }
      );

      return res.status(201).send({ msg: "Record updated...!" });
    } catch (error) {
      return res.status(500).send({ error: "Unable to update password" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

// Get method to fetch count of candidates by ticket number
// http://localhost:8765/api/getCountByTicket/:Ticket_no
export async function getCountByTicket(req, res) {
  try {
    const { Ticket_no } = req.params;

    // Use Promise.all to execute queries concurrently
    const [
      totalnumber_of_candidates,
      rejectedbyaroha,
      selectedbyclient,
      rejectededbyclient,
      FeedBack,
      clientInfo,
    ] = await Promise.all([
      RecuteModule.countDocuments({ Ticket_no }),
      RecuteModule.countDocuments({
        Ticket_no,
        Status: { $regex: "rejected by aroha", $options: "i" },
      }),
      RecuteModule.countDocuments({
        Ticket_no,
        Status: { $regex: "selected By Client", $options: "i" },
      }),
      RecuteModule.countDocuments({
        Ticket_no,
        Status: { $regex: "rejected By Client", $options: "i" },
      }),
      RecuteModule.countDocuments({
        Ticket_no,
        Status: { $regex: "Yet to Receive feedback", $options: "i" },
      }),
      AdminModule.findOne({ Ticket_no }),
    ]);

    // Extract client information
    const Client_Name = clientInfo ? clientInfo.Client_Name : null;
    const Tech_stack = clientInfo ? clientInfo.Tech_stack : null;

    res.json({
      Ticket_no,
      totalnumber_of_candidates,
      rejectedbyaroha,
      selectedbyclient,
      rejectededbyclient,
      FeedBack,
      Client_Name,
      Tech_stack,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the counts." });
  }
}

// http://localhost:8765/api/getCountsForAllTickets
export async function getCountsForAllTickets(req, res) {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$Ticket_no",
          totalnumber_of_candidates: { $sum: 1 },
          rejectedbyaroha: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$Status",
                    regex: /rejected by aroha/i,
                  },
                },
                1,
                0,
              ],
            },
          },
          selectedbyclient: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$Status",
                    regex: /selected By Client/i,
                  },
                },
                1,
                0,
              ],
            },
          },
          rejectededbyclient: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$Status",
                    regex: /rejected By Client/i,
                  },
                },
                1,
                0,
              ],
            },
          },
          FeedBack: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$Status",
                    regex: /Yet to Receive feedback/i,
                  },
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "adminupdates",
          localField: "_id",
          foreignField: "Ticket_no",
          as: "adminInfo",
        },
      },
      {
        $unwind: "$adminInfo",
      },
      {
        $project: {
          Ticket_no: "$_id",
          totalnumber_of_candidates: 1,
          rejectedbyaroha: 1,
          submittedtoclient: {
            $subtract: ["$totalnumber_of_candidates", "$rejectedbyaroha"],
          },
          selectedbyclient: 1,
          rejectededbyclient: 1,
          FeedBack: 1,
          Client_Name: "$adminInfo.Client_Name",
          Tech_stack: "$adminInfo.Tech_stack",
          date: "$adminInfo.date",
          status: "$adminInfo.status",
        },
      },
    ];

    const counts = await RecuteModule.aggregate(pipeline);

    if (counts.length === 0) {
      res.json({ message: "No data found" });
    } else {
      res.json(counts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// http://localhost:8765/api/getuserworkingprogress
export async function getuserworkingprogress(req, res) {
  try {
    const today = new Date(); // Get today's date

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999 (almost midnight of the next day)

    const pipeline = [
      {
        $match: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: { Ticket_no: "$Ticket_no", username: "$username" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "adminupdates",
          localField: "_id.Ticket_no",
          foreignField: "Ticket_no",
          as: "adminData",
        },
      },
      {
        $unwind: "$adminData",
      },
      {
        $project: {
          _id: 0,
          Ticket_no: "$_id.Ticket_no",
          username: "$_id.username",
          count: 1,
          Tech_stack: "$adminData.Tech_stack",
          Client_Name: "$adminData.Client_Name",
        },
      },
    ];

    const results = await RecuteModule.aggregate(pipeline).allowDiskUse(true);

    if (results.length === 0) {
      res.json({ message: "No data found" });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// http://localhost:8765/api/getClients
export async function Complaient(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Authentication failed or user not found" });
    }

    const { Complaient, PostedUser } = req.body;

    // Check if the complaint is empty
    if (!Complaient) {
      return res.status(409).json({ error: "Complaint is required" });
    }

    // Extract the username from the user object
    const username = req.user.username;

    const currentTimeIST = moment
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD hh:mm:ss A");

    const Complaient_details = {
      Complaient,
      PostedUser: username,
      date: currentTimeIST,
    };

    // Create a new ComplaintModel document with the data
    const newComplaint = new DeveloperModel(Complaient_details);

    // Save the ComplaintModel document to the database
    try {
      const result = await newComplaint.save();

      const email = {
        from: "arohatechnologies0@gmail.com",
        to: "abineshajith81@gmail.com",
        subject: "User Suggession",
        html: `
          <h1>User Suggession</h1>
          <h2>Posted By:${result.PostedUser}</h2>
          <h3>Date: ${result.date}</h3>
          <h4>FeedBack: ${result.Complaient}</h4>
          <br/>
          THANK YOU 
          <br/>
          YOUR TRULY AROHA TECHNOLOGIES
        `,
      };

      // Send the email using the transporter
      try {
        const info = await transporter.sendMail(email);
        console.log("Email sent: " + info.response);
        res.status(201).send({
          msg: "User Suggession send successfully",
          Client_Complaient: result,
        });
      } catch (emailError) {
        console.log(emailError);
        res.status(500).send({ error: "Failed to send email" });
      }
    } catch (saveError) {
      console.log(saveError);
      res.status(500).send({ error: "Failed to save complaint" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
}

// http://localhost:8765/api/getallUsername
export async function getAllUsernames(req, res) {
  try {
    // Find all users, select only the 'username' field, and sort alphabetically
    const users = await UserModel.find({}, "username").sort({ username: 1 });

    // Extract usernames as an array of objects
    const usernames = users.map((user) => ({ username: user.username }));

    // Send the usernames as a JSON response
    res.status(200).json(usernames);
  } catch (error) {
    // Handle errors
    console.error("Error fetching usernames:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching usernames." });
  }
}

// http://localhost:8765/api/getAllDomains
export async function getAllDomains(req, res) {
  try {
    // Fetch only the Domain field from all documents in the RecuteModule collection
    const domains = await RecuteModule.find({}, { Domain: 1 });

    // Extract all domain values into a single array
    const domainValues = domains.flatMap((doc) => {
      // If the domain is an array, return the values
      if (Array.isArray(doc.Domain)) {
        return doc.Domain.map((domain) => domain.value);
      }
      // If it's a single value, return it as an array
      return [doc.Domain.value];
    });

    // Use a Set to automatically remove duplicates
    const uniqueDomains = new Set(domainValues);

    // Convert Set to an array of unique domains
    const uniqueDomainsArray = Array.from(uniqueDomains);

    // Create an array of objects with value and label properties
    const domainOptions = uniqueDomainsArray.map((domain) => ({
      value: domain,
      label: domain,
    }));

    // Send the domainOptions array as the response
    res.status(200).json(domainOptions);
  } catch (error) {
    console.error(`Error getting domains from RecuteModule: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching domains." });
  }
}

// http://localhost:8765/api/getAllTechstack
export async function getAllTechstack(req, res) {
  try {
    // Fetch only the Domain field from all documents in the RecuteModule collection
    const domains = await AdminModule.find({}, { Tech_stack: 1 });

    // Extract all domain values into a single array
    const domainValues = domains.flatMap((doc) => {
      // If the domain is an array, return the values
      if (Array.isArray(doc.Tech_stack)) {
        return doc.Tech_stack.map((Tech_stack) =>
          Tech_stack.value.toLowerCase()
        ); // Convert to lowercase
      }
      // If it's a single value, return it as an array
      return [doc.Tech_stack.value.toLowerCase()]; // Convert to lowercase
    });

    // Use a Set to automatically remove duplicates
    const uniqueDomains = new Set(domainValues);

    // Convert Set to an array of unique domains
    const uniqueDomainsArray = Array.from(uniqueDomains);

    // Create an array of objects with value and label properties
    const domainOptions = uniqueDomainsArray.map((domain) => ({
      value: domain,
      label: domain.charAt(0).toUpperCase() + domain.slice(1), // Capitalize first letter
    }));

    // Send the domainOptions array as the response
    res.status(200).json(domainOptions);
  } catch (error) {
    console.error(`Error getting domains from RecuteModule: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching domains." });
  }
}

// POST handler for creating a new client
// http://localhost:8765/api/postClientDetails
export const PostClientDetails = async (req, res) => {
  try {
    const {
      Clientname,
      Address,
      Email,
      MobileNumber,
      HrEmail,
      HrMobileNumber,
    } = req.body;

    // Check if a client with the same address already exists (case-insensitive)
    const existingClient = await clientSchema.findOne({
      Address: { $regex: new RegExp(`^${Address}$`, "i") },
    });
    if (existingClient) {
      return res.status(400).json({
        error: "Address already exists. Please provide a unique address.",
      });
    }

    // Create a new client
    const newClient = new clientSchema({
      Clientname,
      Address,
      Email,
      MobileNumber,
      HrEmail,
      HrMobileNumber,
    });

    // Save the new client to the database
    await newClient.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Client created successfully", client: newClient });
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error for Req_id
      const key = Object.keys(error.keyValue)[0];
      if (key === "Req_id") {
        return res
          .status(400)
          .json({ error: "Req_id is not unique. Please try again." });
      }
      // Handle unique constraint error for other fields if needed
      return res.status(400).json({ error: "Duplicate key error." });
    }
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
};

// get the client details
// GET handler for retrieving all clients or searching clients by name
// http://localhost:8765/api/getClients
export const getClients = async (req, res) => {
  const { Clientname } = req.query; // Get the name from query parameters

  try {
    // If Clientname query parameter is provided, search for clients by name
    if (Clientname) {
      // Find clients whose names contain the search term (case-insensitive)
      const clients = await clientSchema.find({
        Clientname: { $regex: Clientname, $options: "i" }, // Case-insensitive search
      });

      if (clients.length === 0) {
        return res.status(404).json({
          message: "No clients found with the given name.",
        });
      }

      return res.status(200).json({
        message: "Clients found successfully!",
        clients,
      });
    } else {
      // If no Clientname parameter is provided, retrieve all clients
      const clients = await clientSchema.find({});

      return res.status(200).json({
        message: "Clients retrieved successfully!",
        clients,
      });
    }
  } catch (error) {
    console.error("Error retrieving or searching clients:", error);
    return res.status(500).json({
      message: "Error retrieving or searching clients",
      error: error.message,
    });
  }
};
// update client details
// http://localhost:8765/api/updateClient/:id
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (updateData.Address) {
      const existingAddress = await clientSchema.findOne({
        Address: updateData.Address,
        _id: { $ne: id },
      });
      if (existingAddress) {
        return res.status(400).json({
          message: "Client with this address already exists.",
          errorType: "ValidationError",
        });
      }
    }

    const updatedClient = await clientSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res.status(404).json({
        message: "Client not found.",
        errorType: "NotFoundError",
      });
    }

    res.status(200).json({
      message: "Client updated successfully!",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation error occurred.",
        errors: error.errors,
        errorType: "ValidationError",
      });
    } else {
      res.status(500).json({
        message: "Error updating client",
        error: error.message,
        errorType: "ServerError",
      });
    }
  }
};

// http://localhost:8765/api/getClientNames
export const getClientNames = async (req, res) => {
  try {
    // Aggregate to get unique client names from clientSchema
    const clientNamesFromClients = await clientSchema.aggregate([
      {
        $group: {
          _id: "$Clientname", // Group by Clientname
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          Clientname: "$_id", // Rename _id to Clientname
        },
      },
    ]);

    // Aggregate to get unique client names from AdminModule
    const clientNamesFromAdmins = await AdminModule.aggregate([
      {
        $group: {
          _id: "$Client_Name", // Group by Client_Name
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          Clientname: "$_id", // Rename _id to Clientname
        },
      },
    ]);

    // Merge and remove duplicates
    const allClientNames = [
      ...new Set([
        ...clientNamesFromClients.map((c) => c.Clientname),
        ...clientNamesFromAdmins.map((a) => a.Clientname),
      ]),
    ];

    // Send a success response with the unique client names
    res.status(200).json({ clientNames: allClientNames });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

// http://localhost:8765/api/postuser?id=66abcf7e30314339b571ed67
export const getClientById = async (req, res) => {
  const { id } = req.query;

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid client ID format." });
  }

  try {
    // Find the client by its _id
    const client = await clientSchema.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Return the client details
    res.status(200).json({ client });
  } catch (error) {
    console.error("Error retrieving client:", error);
    res
      .status(500)
      .json({ message: "Error retrieving client.", error: error.message });
  }
};
