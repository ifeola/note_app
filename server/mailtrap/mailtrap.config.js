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

export { sender, transport };
