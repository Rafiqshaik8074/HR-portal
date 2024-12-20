import toast from 'react-hot-toast'
import { authenticate,recuterpost } from './Helper';

// validate loginpage username
export async function usernamevaldate(values){
    const errors=UsernameVerify({},values);

    if(values.username){
        // checck user exist or not
        const {status}=await authenticate(values.username);
        if(status !==200){
            errors.exit=toast.error('User does not exist..!')
        }
    }
    return errors;
}
// validate loginpage Email
export async function emailValidate(values){
  const errors=emailVerify({},values);

  if(values.email){
      // checck user exist or not
      const {status}=await authenticate(values.email);
      if(status !==200){
          errors.exit=toast.error('User with this Email does not exist..!')
      }
  }
  return errors;
}


// valdate passsword
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

// validate Reset password
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);
    if(values.password!==values.Confirm_pwt){
        errors.exit=toast.error("password not match...!")
    }
    return errors
}

// validate register Form
export async function registervalidation(values){
    const errors=UsernameVerify({},values);
    passwordVerify(errors,values);
    emailVerify(errors,values);

    return errors

}

// validate profile page
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}
// ********************************************--*******************//



//validate password
function passwordVerify(errors = {}, values){
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}




//validate Username
function UsernameVerify(error={},values){
    if(!values.username){
        error.username=toast.error("UserName Required...!")
    }else if(values.username.includes(" ")){
        error.username=toast.error('Invald Username')
    }
    return error;
}

// validate email
function emailVerify(error={},values){
    if(!values.email){
        error.email=toast.error("Email required")
    }else if(values.email.includes(" ")){
        error.email=toast.error("Wrong email..!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}

// recuter validate
export async function recuterValidate(values,file) {
    const errors = {};
    const mobileNumberPattern = /^(\+91)?\s*\d{10}$/;
  
   if (values.username) {
      // Check if user exists
      const response = await recuterpost(values); 
      if (response.error) {
        errors.exit = toast.error("User already exist..!");
      }
    }if(!values.CandidateName){
        errors.exit=toast.error("CandidateName Required..!")
    }else if (values.CandidateName.trim() === "") {
        errors.CandidateName = "Candidate Name should not be empty";
        toast.error(errors.CandidateName);
      }    
      if (!values.MobileNumber) {
        errors.MobileNumber = toast.error("MobileNumber Required..!");
      } else {
        // Remove any spaces from the mobile number
        values.MobileNumber = values.MobileNumber.replace(/\s/g, '');
    
        if (!mobileNumberPattern.test(values.MobileNumber)) {
          errors.MobileNumber = "Invalid mobile number. Please enter a 12-digit number with optional +91 country pincode and without spaces.";
          toast.error(errors.MobileNumber);
        }
      }
      if (values.CTC === undefined) {
        errors.exit = toast.error("CTC Required..!");
      } else if (isNaN(values.CTC) || parseFloat(values.CTC) < 0) {
        errors.exit = toast.error("Invalid CTC. Please enter a non-negative number.");
      }
      
      if (values.ECTC === undefined) {
        errors.exit = toast.error("ECTC Required..!");
      } else if (isNaN(values.ECTC) || parseFloat(values.ECTC) < 0) {
        errors.exit = toast.error("Invalid ECTC. Please enter a non-negative number.");
      }
    if (!values.Email) {
        errors.Email = "Email is required";
        toast.error(errors.Email);
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(values.Email)) {
        errors.Email = "Invalid Email address";
        toast.error(errors.Email);
      }
      
    return errors;
  }
  
  export async function adminPostValidate(values,file) {
    const errors = {};
  
    if (!values.Client_Name.trim()) {
      errors.exit =toast.error("Client Name is required");
    }
    if (!values.Tech_stack || values.Tech_stack.length === 0) {
        errors.Tech_stack = 'Please select at least one Tech Stack';
      }
    if (!values.Mode || values.Mode.length === 0) {
        errors.exit =toast.error("Mode Of Work is required");
    }  
          // Validation: Check if min_Yre_of_exp is greater than max_Yre_of_exp
          if (parseInt(values.min_Yre_of_exp.value) > parseInt(values.max_Yre_of_exp.value)) {
            errors.exit = toast.error('Min Year of Experience cannot be greater than Max Year of Experience');
          
          }
    return errors;
  }



  // Client Validation
  export async function clientValidate(values) {
  const errors = {};
  const mobileNumberPattern = /^(\+91)?\s*\d{10}$/;
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Clientname Validation
  if (!values.Clientname) {
    errors.Clientname = "Clientname is required.";
    toast.error("Clientname is required.");
  } else if (values.Clientname.trim() === "") {
    errors.Clientname = "Clientname should not be empty.";
    toast.error("Clientname should not be empty.");
  }

  // MobileNumber Validation
  if (!values.MobileNumber) {
    errors.MobileNumber = "Mobile Number is required.";
    toast.error("Mobile Number is required.");
  } else {
    // Remove any spaces from the mobile number
    const cleanedNumber = values.MobileNumber.replace(/\s/g, '');
    if (!mobileNumberPattern.test(cleanedNumber)) {
      errors.MobileNumber = "Invalid mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.";
      toast.error("Invalid mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.");
    }
  }

  // Email Validation
  if (!values.Email) {
    errors.Email = "Email is required.";
    toast.error("Email is required.");
  } else if (!emailPattern.test(values.Email)) {
    errors.Email = "Invalid Email address.";
    toast.error("Invalid Email address.");
  }

  // HrEmail Validation
  if (!values.HrEmail) {
    errors.HrEmail = "HR Email is required.";
    toast.error("HR Email is required.");
  } else if (!emailPattern.test(values.HrEmail)) {
    errors.HrEmail = "Invalid HR Email address.";
    toast.error("Invalid HR Email address.");
  }

  // HrMobileNumber Validation
  if (!values.HrMobileNumber) {
    errors.HrMobileNumber = "HR Mobile Number is required.";
    toast.error("HR Mobile Number is required.");
  } else {
    // Remove any spaces from the HR mobile number
    const cleanedHrNumber = values.HrMobileNumber.replace(/\s/g, '');
    if (!mobileNumberPattern.test(cleanedHrNumber)) {
      errors.HrMobileNumber = "Invalid HR mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.";
      toast.error("Invalid HR mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.");
    }
  }

  // Address Validation
  if (!values.Address) {
    errors.Address = "Address is required.";
    toast.error("Address is required.");
  }

  // Add additional validations as needed

  return errors;
}