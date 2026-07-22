import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";

export interface LeadSubmissionPayload {
    name?: string;
    phone: string;
    email?: string;
    location?: string;
    propertyType?: string;
    budget?: string;
    message?: string;
    source?: string;
}

const getTransporter = () => {
    const user = process.env.MAIL_USER || "getwebstrike@gmail.com";
    const pass = (process.env.MAIL_PASS || "grnq iekd aufo amsi").replace(/\s+/g, "");

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user,
            pass,
        },
    });
};

export const submitLead = createServerFn({ method: "POST" })
    .validator((data: LeadSubmissionPayload) => data)
    .handler(async ({ data }) => {
        const {
            name = "Not provided",
            phone,
            email = "Not provided",
            location = "Not provided",
            propertyType = "Not specified",
            budget = "Not specified",
            message = "None",
            source = "Website Form",
        } = data;

        if (!phone || phone.trim() === "") {
            throw new Error("Phone number is required");
        }

        const mailUser = process.env.MAIL_USER || "getwebstrike@gmail.com";
        const mailTo = process.env.MAIL_TO || "getwebstrike@gmail.com";

        const subject = `🔥 New Lead Received (${source}): ${name !== "Not provided" ? name : phone}`;

        const submittedAt = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "medium",
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #1a1a1a; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #eaeaea; }
                    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; }
                    .header p { margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; }
                    .content { padding: 30px 24px; }
                    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; text-transform: uppercase; }
                    .lead-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                    .lead-table th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; width: 35%; }
                    .lead-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 500; color: #0f172a; }
                    .phone-highlight { font-size: 16px; font-weight: 700; color: #d97706; }
                    .message-box { background: #f8fafc; border-left: 4px solid #d97706; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #334155; margin-top: 10px; line-height: 1.5; }
                    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #edf2f7; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Woodshine Interiors</h1>
                        <p>New Lead Notification</p>
                    </div>
                    <div class="content">
                        <span class="badge">Source: ${source}</span>
                        <table class="lead-table">
                            <tr>
                                <th>Full Name</th>
                                <td>${name}</td>
                            </tr>
                            <tr>
                                <th>Phone Number</th>
                                <td><a href="tel:${phone}" class="phone-highlight" style="text-decoration:none;">${phone}</a></td>
                            </tr>
                            <tr>
                                <th>Email Address</th>
                                <td>${email !== "Not provided" ? `<a href="mailto:${email}">${email}</a>` : "Not provided"}</td>
                            </tr>
                            <tr>
                                <th>Location</th>
                                <td>${location}</td>
                            </tr>
                            <tr>
                                <th>Property Type</th>
                                <td>${propertyType}</td>
                            </tr>
                            <tr>
                                <th>Approx. Budget</th>
                                <td>${budget}</td>
                            </tr>
                            <tr>
                                <th>Submission Time</th>
                                <td>${submittedAt}</td>
                            </tr>
                        </table>
                        
                        <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 20px;">Project Details / Message</div>
                        <div class="message-box">${message}</div>
                    </div>
                    <div class="footer">
                        Sent automatically via Woodshine Lead Form System &bull; ${new Date().getFullYear()}
                    </div>
                </div>
            </body>
            </html>
        `;

        const textContent = `New Lead Submission (${source}):\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nLocation: ${location}\nProperty Type: ${propertyType}\nBudget: ${budget}\nMessage: ${message}\nSubmitted At: ${submittedAt}`;

        const transporter = getTransporter();

        const info = await transporter.sendMail({
            from: `"Woodshine Leads" <${mailUser}>`,
            to: mailTo,
            subject,
            text: textContent,
            html: htmlContent,
        });

        console.log("Lead email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    });
