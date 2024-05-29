import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import emailValidator, { validate } from "deep-email-validator";
import { User } from "../models/UserModels.js";
import {
  NewManualUser,
  NewManualUserLogin,
  NewUserRequestBody,
  destructureDoc,
} from "../types/types.js";
import ErrorHandler from "../utils/Error-class.js";
import jwt from "jsonwebtoken";

const oneFifty = 1000 * 60 * 60 * 24 * 150;

export const newUser = async (
  req: Request<{}, {}, NewManualUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, gender, dob, password } = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    if (!name || !email || !password) {
      next(new ErrorHandler("Something is missings", 401));
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) return next(new ErrorHandler("Email id already exist!", 400));

    const google = bcrypt.hashSync(email, 5);

    const newUser = await User.create({
      name,
      email,
      google,
      LoginType: "manual",
      gender,
      dob,
      password: hashPassword,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${newUser.name}`,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const userManualLogin = async (
  req: Request<{}, {}, NewManualUserLogin>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler("All Fields are Needed", 400));

    let user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("User Not Found", 404));

    const ValidPassword = bcrypt.compareSync(password, user!.password);
    if (!ValidPassword) return next(new ErrorHandler("Wrong Password", 400));

    // object destructuring
    const { password: pass, createdAt, _id, __v, updatedAt,  ...rest }: destructureDoc =
        user!._doc;

    // cookies
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        googleKey: user.google,
        role: user.role,
      },
      String(process.env.JWT_SECRET)
    );

    res
      .cookie("access_token", token, { maxAge: oneFifty, secure: true })
      .status(201)
      .json({
        success: true,
        user: rest,
        message: "Welcome Back " + user.name,
      });
  } catch (error) {
    next(error);
  }
};

export const Google = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, google, photo, gender, dob } = req.body;

    let user = await User.findOne({ email });

    if (user) {

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          googleKey: user.google,
          role: user.role,
        },
        String(process.env.JWT_SECRET)
      );

      const { password, createdAt, __v, _id, updatedAt, ...rest }: destructureDoc = await
      user!._doc;

      return res
      .cookie("access_token", token, { maxAge: oneFifty, secure: true})
      .status(200).json({
        statusCode: 200,
        success: true,
        user: rest,
        message: `Welcome Back, ${user.name[0].toUpperCase() + name.slice(1)}`,
      });

    }

    if (!name || !email || !google || !photo || !gender || !dob) {
      next(new ErrorHandler("Something is missing", 401));
    }

    const hashPassword = bcrypt.hashSync(
      email + Math.floor(Math.random() * 999),
      10
    );

    const newUser = await User.create({
      name,
      email,
      google,
      password: hashPassword,
      photo,
      LoginType: "google",
      gender,
      dob,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        googleKey: newUser.google,
        role: newUser.role,
      },
      String(process.env.JWT_SECRET)
    );

    const { password, createdAt, __v, _id, updatedAt, ...rest }: destructureDoc = await
    newUser!._doc;

    return res
      .cookie("access_token", token, { maxAge: oneFifty, secure: true })
      .status(200)
      .json({
        success: true,
        user: rest,
        message: `Welcome, ${newUser.name}`,
      });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const isLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenId = (req as any).data.id
    if (tokenId) {
      const { id } = await (req as any).data;
      const getUser = await User.findById(id);

      if (!getUser) next(new ErrorHandler("user not found", 404));

      const { password, createdAt, __v, _id, updatedAt, ...rest }: destructureDoc =
        getUser!._doc;

      res.status(201).json({
        success: true,
        user: rest,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const AllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);

    if (!getUser) next(new ErrorHandler("user not found", 404));

    const { password, createdAt, updatedAt, ...rest }: destructureDoc =
      getUser!._doc;

    res.status(201).json({
      success: true,
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mainUser = await User.findById((req as any).data.id).select("role");

    if (mainUser!.role == "admin") {
      const all = await User.find();
      res.status(200).json(all);
    } else {
      next(new ErrorHandler("Admin Needed!", 400));
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) next(new ErrorHandler("user not found", 404));

    const { password, createdAt, updatedAt, ...rest }: destructureDoc =
      user!._doc;

    return res.status(200).json({
      success: true,
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mainUser = await User.findById((req as any).data.id).select("role");

    if (mainUser!.role == "admin") {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return next(new ErrorHandler("User Not Exist", 404));

      await user.deleteOne();

      return res.status(200).json({
        success: true,
        data: "User Has Been Deleted",
      });
    } else {
      next(new ErrorHandler("Admin Needed!", 400));
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id } = await (req as any).data;
    const getUser = await User.findById(id);

    res.clearCookie("access_token").json({
      message: "Dear Customer, We will miss you!",
      success: true
    })

  } catch (error) {
    next(error)
  }
}

// const { id } = (req as any).data
// const mainUser = await User.findById().select("role");

//         if (mainUser!.role == "admin"){

//         }else{
// next(new ErrorHandler("Admin Needed!", 400))
//         }
