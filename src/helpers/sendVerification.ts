import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";
import { render } from "@react-email/components";

export async function sendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Anonymous Msgs | Verification Code",
      html: await render(VerificationEmail({ username, otp:verifyCode })),
    });

    return { success: true, message: "Successfully sent verification email" };
  } catch (emailerror) {
    console.error("Error in sending verification Email!!", emailerror);
    return { success: false, message: "Failed to send verification email" };
  }
}
