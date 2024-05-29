import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  // _id: string;
  name: string;
  email: string;
  google: string;
  password: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female" | "other";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual attribuut
  age?: number;
  _doc?: any;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email Already Exist"],
      required: [true, "Please enter Email"],
      validate: validator.default.isEmail,
    },
    google: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter Password"],
    },
    photo: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
    },
    LoginType: {
      type: String,
      enum: ["google", "manual"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("age").get(function () {
  const today = new Date();
  if (this.dob) {
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }
});

export const User = mongoose.model<IUser>("User", UserSchema);
