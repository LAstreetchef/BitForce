import nodemailer from "nodemailer";
import type { Lead } from "@shared/schema";

const GMAIL_USER = process.env.GMAIL_USER || "kammiceli@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Bit Force";

function createTransporter() {
  if (!GMAIL_APP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendLeadConfirmationEmail(lead: Lead): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping email");
    return false;
  }

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: lead.email,
    subject: "Thank you for your interest - Bit Force",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bit Force</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Digital Intelligence Marketing</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #1e40af; margin-top: 0;">Hi ${lead.fullName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            Thank you for reaching out to us! We've received your inquiry and our team is excited to help you with your home service needs.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Interests:</h3>
            <p style="color: #374151; margin-bottom: 0;">${lead.interests}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            One of our brand ambassadors will be in touch with you shortly to discuss the best solutions for your needs. In the meantime, feel free to reply to this email if you have any questions.
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            We're committed to connecting you with trusted local service providers who can transform your home.
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            Best regards,<br/>
            <strong>The Bit Force Team</strong>
          </p>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            This email was sent because you submitted an inquiry through our website.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${lead.email}`);
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}

export async function sendLeadStatusUpdateEmail(
  lead: Lead,
  serviceName: string,
  newStatus: string
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping email");
    return false;
  }

  const statusMessages: Record<string, { subject: string; message: string }> = {
    contacted: {
      subject: "We're reaching out - Bit Force",
      message: "Great news! One of our ambassadors is actively working on connecting you with the right service provider for your needs. Expect to hear from them soon.",
    },
    interested: {
      subject: "Exciting progress on your inquiry - Bit Force",
      message: "We've identified a service that matches your needs perfectly. Our ambassador will be in touch with more details shortly.",
    },
    sold: {
      subject: "Congratulations on your service booking - Bit Force",
      message: "Fantastic! Your service has been confirmed. We're thrilled to have helped you find the right solution for your home.",
    },
  };

  const statusInfo = statusMessages[newStatus];
  if (!statusInfo) {
    return false;
  }

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: lead.email,
    subject: statusInfo.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bit Force</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Digital Intelligence Marketing</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #1e40af; margin-top: 0;">Hi ${lead.fullName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            ${statusInfo.message}
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Service Update:</h3>
            <p style="color: #374151; margin-bottom: 0;"><strong>${serviceName}</strong></p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            If you have any questions, simply reply to this email and we'll get back to you as soon as possible.
          </p>
          
          <p style="color: #374151; line-height: 1.6;">
            Best regards,<br/>
            <strong>The Bit Force Team</strong>
          </p>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            This is an update regarding your service inquiry with Bit Force.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${lead.email} for ${serviceName}`);
    return true;
  } catch (error) {
    console.error("Failed to send status update email:", error);
    return false;
  }
}

export async function sendSupportChatInitiatedEmail(
  ambassadorName: string,
  ambassadorUserId: string,
  firstMessageContent: string
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping support chat notification");
    return false;
  }

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Support Chat: ${ambassadorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Support Chat Initiated</h1>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <p style="color: #374151; line-height: 1.6;">
            An ambassador has started a new support conversation and is waiting for assistance.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0 0 10px 0;"><strong>Ambassador:</strong> ${ambassadorName}</p>
            <p style="color: #1e40af; margin: 0 0 10px 0;"><strong>User ID:</strong> ${ambassadorUserId}</p>
            <p style="color: #374151; margin: 0;"><strong>Message:</strong></p>
            <p style="color: #374151; margin: 10px 0 0 0; padding: 15px; background: white; border-radius: 4px; border-left: 3px solid #3b82f6;">
              ${firstMessageContent}
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            Please log in to the admin portal to respond to this support request.
          </p>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            This is an automated notification from the Bit Force support system.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Support chat notification sent for ambassador: ${ambassadorName}`);
    return true;
  } catch (error) {
    console.error("Failed to send support chat notification email:", error);
    return false;
  }
}

export async function sendAdminNotificationEmail(lead: Lead): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping admin notification");
    return false;
  }

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Lead: ${lead.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Lead Received</h1>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${lead.email}">${lead.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.address}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Interests:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.interests}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for new lead: ${lead.fullName}`);
    return true;
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return false;
  }
}
