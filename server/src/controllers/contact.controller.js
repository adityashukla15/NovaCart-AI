const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const sendContactMessage = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        subject,
        message,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!name || !email || !subject || !message) {

        throw new ApiError(
            400,
            "All fields are required"
        );

    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedSubject = subject.trim();
    const normalizedMessage = message.trim();

    if (!normalizedName) {
        throw new ApiError(400, "Name is required");
    }

    if (!normalizedEmail) {
        throw new ApiError(400, "Email is required");
    }

    if (!normalizedSubject) {
        throw new ApiError(400, "Subject is required");
    }

    if (!normalizedMessage) {
        throw new ApiError(400, "Message is required");
    }

    // ======================================
    // EMAIL CONTENT
    // ======================================

    const emailSubject = `NovaCart Contact: ${normalizedSubject}`;

    const emailText = `
You have received a new contact message from NovaCart.

----------------------------------------
CONTACT DETAILS
----------------------------------------

Name: ${normalizedName}
Email: ${normalizedEmail}
Subject: ${normalizedSubject}

----------------------------------------
MESSAGE
----------------------------------------

${normalizedMessage}

----------------------------------------
This message was sent from the NovaCart Contact Form.
----------------------------------------
`;

    // ======================================
    // SEND EMAIL
    // ======================================

    await sendEmail(
        process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        emailSubject,
        emailText
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json(

        new ApiResponse(
            200,
            "Your message has been sent successfully"
        )

    );

});

module.exports = {
    sendContactMessage,
};