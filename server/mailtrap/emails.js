import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { transport, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	await transport
		.sendMail({
			from: sender,
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationToken
			),
			category: "Email verification",
		})
		.then(console.log, console.error);
};
