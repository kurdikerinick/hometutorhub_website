const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://srtdemo-dfee0-default-rtdb.firebaseio.com" // Replace with your database URL
  });

/**
 * Function to generate a random password.
 * @returns {string} Random password.
 */
function generateRandomPassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8;
    let randomPassword = "";
    for (let i = 0; i < length; i++) {
        randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomPassword;
}

exports.sendVerificationEmail = functions.auth.user().onCreate((user) => {
    const randomPassword = generateRandomPassword();
    const emailContent = {
        from: "Your App <noreply@yourapp.com>",
        to: user.email,
        subject: "Verify your email and set your password",
        html: `
            <p>Hello ${user.displayName || "there"},</p>
            <p>Welcome to Your App! To complete your registration, please verify your email address and set your password:</p>
            <p>Verification Link: <a href="https://yourapp.com/verifyEmail?email=${user.email}&password=${randomPassword}">Verify Email</a></p>
            <p>Random Password: ${randomPassword}</p>
            <p>If you didn't request this, you can ignore this email.</p>
            <p>Thanks,</p>
            <p>Your App Team</p>
        `,
    };

    return admin.auth().sendEmailVerification(user.email, emailContent);
});
