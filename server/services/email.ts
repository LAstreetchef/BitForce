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

export async function sendAmbassadorInviteEmail(
  inviteeName: string,
  inviteeEmail: string,
  inviterName: string,
  referralCode: string
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping ambassador invite email");
    return false;
  }

  const signupUrl = `${process.env.REPLIT_DOMAINS?.split(',')[0] ? 'https://' + process.env.REPLIT_DOMAINS?.split(',')[0] : ''}/ambassador-signup?ref=${referralCode}`;

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: inviteeEmail,
    subject: `${inviterName} invited you to join Bit Force - Earn While Learning AI!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
          <p style="color: #e0f2fe; margin: 15px 0 0 0; font-size: 16px;">Join the Bit Force Ambassador Team</p>
        </div>
        
        <div style="padding: 35px; background: #ffffff;">
          <h2 style="color: #1e40af; margin-top: 0;">Hi ${inviteeName}!</h2>
          
          <p style="color: #374151; line-height: 1.7; font-size: 16px;">
            <strong>${inviterName}</strong> thinks you'd be a great fit for the Bit Force Ambassador Program and personally invited you to join our growing team!
          </p>
          
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #059669; margin: 0 0 15px 0;">What You'll Get:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Earn $20-$50</strong> per customer you help</li>
              <li><strong>$50 instant bonus</strong> for each ambassador you recruit</li>
              <li><strong>20% recurring income</strong> from your team's subscriptions</li>
              <li><strong>Free AI training</strong> - learn valuable skills while you earn</li>
              <li><strong>Flexible schedule</strong> - work on your own time</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">Our Mission</h3>
            <p style="color: #374151; margin: 0; line-height: 1.7;">
              We help everyday people with technology - from backing up family photos to setting up smart home devices. 
              No tech degree required! If you're patient, friendly, and love helping others, you'll thrive here.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${signupUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Join the Team - Get Started
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Just <strong>$29</strong> to get started (+ $19.99/month) - your first sale pays for itself!
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
            <p style="color: #374151; line-height: 1.7; font-size: 14px;">
              <strong>${inviterName}</strong> will be your mentor and earn a bonus when you join - so they're invested in your success! 
              Feel free to reach out to them with any questions.
            </p>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 25px; text-align: center;">
          <p style="color: white; margin: 0 0 10px 0; font-weight: bold;">Bitforce AI Buddies</p>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            Help others and get paid to learn AI
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Ambassador invite email sent to ${inviteeEmail} from ${inviterName}`);
    return true;
  } catch (error) {
    console.error("Failed to send ambassador invite email:", error);
    return false;
  }
}

export async function sendAIBuddyCustomerInviteEmail(
  contactName: string,
  contactEmail: string,
  inviterName: string
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("GMAIL_APP_PASSWORD not configured - skipping AI Buddy customer invite email");
    return false;
  }

  const websiteUrl = process.env.REPLIT_DOMAINS?.split(',')[0] ? 'https://' + process.env.REPLIT_DOMAINS?.split(',')[0] : '';

  const mailOptions = {
    from: `"${FROM_NAME}" <${GMAIL_USER}>`,
    to: contactEmail,
    subject: `${inviterName} wants to introduce you to your personal AI & Tech Concierge!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Meet Your Personal AI Buddy</h1>
          <p style="color: #e0e7ff; margin: 15px 0 0 0; font-size: 16px;">Your Technology & Home Services Concierge</p>
        </div>
        
        <div style="padding: 35px; background: #ffffff;">
          <h2 style="color: #1e40af; margin-top: 0;">Hi ${contactName}!</h2>
          
          <p style="color: #374151; line-height: 1.7; font-size: 16px;">
            <strong>${inviterName}</strong> thought you'd love having your own personal AI & technology concierge - and wanted to introduce you to <strong>Bitforce Buddies</strong>!
          </p>
          
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">What is a Bitforce Buddy?</h3>
            <p style="color: #374151; margin: 0; line-height: 1.7;">
              Think of us as your personal tech support friend who's always available. We help with everything from setting up smart home devices to finding trusted home service professionals - all while teaching you to use AI tools that make life easier.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h3 style="color: #7c3aed; margin: 0 0 15px 0;">Featured Services We Offer:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Photo & Video Backup</strong> - Never lose precious memories again</li>
              <li><strong>Smart Home Setup</strong> - Thermostats, cameras, voice assistants & more</li>
              <li><strong>Home Security</strong> - Professional installation from trusted providers</li>
              <li><strong>Tech Support</strong> - Help with computers, phones, and gadgets</li>
              <li><strong>Home Services</strong> - Connect with vetted local contractors</li>
              <li><strong>AI Training</strong> - Learn to use ChatGPT, Gemini & more!</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <p style="color: #059669; margin: 0; font-size: 18px; font-weight: bold;">
              No subscriptions. No commitments. Just help when you need it.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${websiteUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Learn More About Bitforce Buddies
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
            <p style="color: #374151; line-height: 1.7; font-size: 14px;">
              <strong>${inviterName}</strong> is your personal Bitforce Buddy and will be your main point of contact. Feel free to reply to this email or reach out to them directly with any questions!
            </p>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 25px; text-align: center;">
          <p style="color: white; margin: 0 0 10px 0; font-weight: bold;">Bitforce AI Buddies</p>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            Your Personal AI & Technology Concierge
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`AI Buddy customer invite email sent to ${contactEmail} from ${inviterName}`);
    return true;
  } catch (error) {
    console.error("Failed to send AI Buddy customer invite email:", error);
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
