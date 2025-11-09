import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;

const transport = nodemailer.createTransport(
	MailtrapTransport({
		token: TOKEN,
	})
);

const sender = {
	address: "hello@demomailtrap.co",
	name: "Arogunmasa Abayomi A.",
};
// const recipients = ["nomorelimit11@gmail.com"];

transport
	.sendMail({
		from: sender,
		to: recipients,
		subject: "You are awesome!",
		text: "Congrats for sending test email with Mailtrap!",
		category: "Integration Test",
	})
	.then(console.log, console.error);

export { sender, transport };
