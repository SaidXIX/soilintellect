exports.passwordResetTemplate = (firstName, email, passwordResetToken) => {
  return `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password at Soilintellect</title>
  </head>
  <body style="font-family: C, sans-serif; background-color: #f2f2f2; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <div style="color: #001E2B; text-align: center; padding: 20px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h2>Reset Your Password at Soilintellect</h2>
      </div>
      <div style="padding: 20px; text-align: center;">
        <h3 style="margin-bottom: 0;">Hello ${firstName},</h3>
        <p style="margin-top: 5px;">You've requested to reset the password for your account at Soilintellect. Please click the following link to reset it:</p>
        <a style="display: inline-block; padding: 10px 20px; background: #001E2B; color: #00ED64; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold;" href="${process.env.PASSWORD_RESET_VERIFICATION_LINK}${passwordResetToken}/${email}">Reset Password Link</a>
        <p style="margin-top: 20px;">This link is valid for 01 hour. If you're unable to reset your password within this time, please repeat the process.</p>
        <p style="margin-top: 20px;">If you have any questions or need further assistance, feel free to contact us.</p>
      </div>
    </div>
  </body>
  </html>
      `
}
