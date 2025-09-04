import nodemailer from "nodemailer";

const sendEmail = async (options) => {
	
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,   
		auth: {
			user: process.env.SMTP_USER,  
			pass: process.env.SMTP_PASS,  
		},
	});

	// mail options
	

	// send mail
	const info=await transporter.sendMail({
		from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
		to: "r.jaiswal7369@gmail.com, baz@example.com",
		subject: "Hello ✔",
		text: "Hello world?", // plain‑text body
		html: "<b>Hello world?</b>", // HTML body
	});
	console.log("Message sent:", info);
	
};

export default sendEmail;
