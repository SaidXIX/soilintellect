exports.verifyEmailTemplate = (firstName, email, verificationToken) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Soilintellect</title>
  </head>
  
  <body style="font-family: C, sans-serif; background-color: #f2f2f2; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <div style="color: #001E2B; text-align: center; padding: 20px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h1>Welcome to Soilintellect</h1>
      </div>
      <div style="padding: 20px; text-align: center;">
        <h3 style="margin-bottom: 0;">${firstName} Welcome </h3>
        <p style="margin-top: 5px;">Thank you for creating an account on Soilintellect! To verify ownership of this email, please click on the following link</p>
        <a style="display: inline-block; padding: 10px 20px; background: #001E2B; color: #00ED64; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold;" href="${process.env.EMAIL_VERIFICATION_LINK}${verificationToken}/${email}">Verification Link</a>
        <p style="margin-top: 20px;">If you have any questions or need further assistance, please feel free to contact us.</p>
      </div>
    </div>
  </body>
  
  </html>
  
    `
}
