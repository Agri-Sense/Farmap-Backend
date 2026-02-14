import asyncHandler from "../../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import jwtUtils from "../../utils/jwtUtils.js";
import uploadImage from "../../utils/uploadImage.js";

const SignupController = asyncHandler(async (req, res) => {
  if (isBodyEmpty(req.body)) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  let validateDataResponse = validateData(req.body);

  if (!validateDataResponse.success) {
    return res
      .status(400)
      .json({ success: false, error: validateDataResponse.error });
  }

  let doesUserAlreadyExists = await User.findOne({
    email: req.body.email,
    username: req.body.username,
  });

  if (doesUserAlreadyExists) {
    return res
      .status(400)
      .json({ success: false, error: "Username or email already exists." });
  }

  let hash = bcrypt.hashSync(req.body.password, 10);

  req.body.password = hash;

  // Make file upload optional for local dev
  let profilePicUrl = "https://res.cloudinary.com/du4ytrjmm/image/upload/v1673176521/farmap/blank-profile-picture-973460_1280_snt79x.png";

  if (req.files && req.files.length > 0) {
    let obj = await uploadImage(req.files[0]);

    if (obj.success !== false && obj.data && obj.data.url) {
      profilePicUrl = obj.data.url;
    }
  }

  req.body.profile_pic = profilePicUrl;

  let newUser = new User({ ...req.body });
  let newUserData = await newUser.save();

  let token = jwtUtils.generateToken(newUserData);

  res
    .status(201)
    .json({ success: true, message: "New account created", token });
});

function isBodyEmpty(obj) {

  let keys = Object.keys(obj);

  for (const key of keys) {
    if (
      !obj[key] ||
      obj[key] == undefined ||
      (obj[key] == "" && key != "firm_name")
    ) {
      return true;
      break;
    }
  }

  return false;
}

function validateData(obj) {
  if (obj.phone.length != 10) {
    return { error: "Phone number must be 10 digit.", success: false };
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(obj.email)) {
    return { error: "Invalid email address.", success: false };
  }

  if (obj.full_name.split(" ").length < 2) {
    return { error: "Please enter full name.", success: false };
  }

  return { success: true };
}

export default SignupController;
