import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.models.js";

import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //todo, destructuring it
  const { fullname, email, username, password } = req.body;

  //validation request should match this order ..
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required ");
  }

  //existing user ?
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //handle images
  console.log(req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing ");
  }

  // uploading not in  use now
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // let coverImage = "";
  // if (coverLocalPath) {
  //   //prone
  //   const coverImage = await uploadOnCloudinary(coverImage);
  // }

  // uploding avatar
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploding avatar ", error);
    throw new ApiError(500, " Failed to upload  Avatar");
  }

  // uploading coverImage

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploaded coverImage", coverImage);
  } catch (error) {
    console.log("Error uploding coverImage ", error);
    throw new ApiError(500, " Failed to upload  coverImage");
  }

  try {
    const user = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    // not compulsory fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // deletion

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully "));
  } catch (error) {
    console.log("User Creation Failed", error);

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    //deletion
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted "
    );
  }
});

export { registerUser };
