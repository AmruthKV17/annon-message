import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/Models/User.model";
import { sendVerification } from "@/helpers/sendVerification";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists!1",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
        {
          success: false,
          message: "User with this email already exists!",
        },
        {
          status: 400,
        }
      );

      }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }

    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAccepting: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerification(email, username, verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json({
      success: true,
      message: "User registered Successfully, Please verify your email.",
    },{
        status: 201
    });
  } catch (error) {
    console.error("Error in registering User: ", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering User ",
      },
      {
        status: 500,
      }
    );
  }
}
