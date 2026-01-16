import jsPDF from "jspdf";

import toolAiAssistant from "@assets/Screenshot_2026-01-09_153919_1767991243060.png";
import toolSecurityCheck from "@assets/Screenshot_2026-01-09_153928_1767991243060.png";
import toolFriendFinder from "@assets/Screenshot_2026-01-09_153937_1767991243059.png";
import toolPropertyLookup from "@assets/Screenshot_2026-01-09_153951_1767991243059.png";
import toolIntelligence from "@assets/Screenshot_2026-01-09_154003_1767991243059.png";
import productMonthly from "@assets/Screenshot_2026-01-09_154927_1767992059208.png";
import productOneTime from "@assets/Screenshot_2026-01-09_154933_1767992059208.png";
import productBundle from "@assets/Screenshot_2026-01-09_154943_1767992059208.png";
import productScanner from "@assets/Screenshot_2026-01-09_154954_1767992059208.png";

async function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateExplainerPdf(): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const addHeader = (text: string, size: number = 24) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 64, 175);
    pdf.text(text, margin, yPos);
    yPos += size * 0.5 + 5;
  };

  const addSubheader = (text: string, size: number = 16) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(79, 70, 229);
    pdf.text(text, margin, yPos);
    yPos += size * 0.4 + 3;
  };

  const addText = (text: string, size: number = 11) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(55, 65, 81);
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPos);
    yPos += lines.length * size * 0.4 + 3;
  };

  const addBulletPoint = (text: string, size: number = 11) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(55, 65, 81);
    const bulletMargin = margin + 5;
    const bulletContentWidth = contentWidth - 10;
    const lines = pdf.splitTextToSize(text, bulletContentWidth);
    pdf.text("\u2022", margin, yPos);
    pdf.text(lines, bulletMargin, yPos);
    yPos += lines.length * size * 0.4 + 2;
  };

  const addSpacing = (space: number = 8) => {
    yPos += space;
  };

  const checkPageBreak = (requiredSpace: number = 50) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
  };

  const addImage = async (src: string, title: string, maxWidth: number = 80, maxHeight: number = 50) => {
    try {
      checkPageBreak(maxHeight + 20);
      const base64 = await loadImageAsBase64(src);
      const img = new Image();
      img.src = base64;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const aspectRatio = img.width / img.height;
      let imgWidth = maxWidth;
      let imgHeight = maxWidth / aspectRatio;
      
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }
      
      const xPos = (pageWidth - imgWidth) / 2;
      pdf.addImage(base64, "PNG", xPos, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 3;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(107, 114, 128);
      const textWidth = pdf.getTextWidth(title);
      pdf.text(title, (pageWidth - textWidth) / 2, yPos);
      yPos += 8;
    } catch (error) {
      console.error("Failed to load image:", title, error);
      addText(`[Image: ${title}]`);
    }
  };

  pdf.setFillColor(30, 64, 175);
  pdf.rect(0, 0, pageWidth, 40, "F");
  
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("BitForce", pageWidth / 2, 22, { align: "center" });
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text("Digital Empowerment Partner", pageWidth / 2, 32, { align: "center" });
  
  yPos = 55;

  addHeader("The Problem");
  addText("In today's digital world, every day, individuals and businesses face digital challenges:");
  addSpacing(3);
  addBulletPoint("Security Threats - Protecting your digital identity and data");
  addBulletPoint("AI Complexity - Understanding and leveraging artificial intelligence");
  addBulletPoint("Technological Overwhelm - Keeping up with rapidly changing technology");
  addSpacing(10);

  addHeader("Introducing BitForce");
  addText("Your Digital Empowerment Partner. We protect, empower, and connect you in the digital world.");
  addSpacing(10);

  checkPageBreak(80);
  addHeader("Our Solutions");
  addSpacing(3);
  
  addSubheader("Advanced Digital Security");
  addText("Shield protecting data streams - comprehensive security solutions to keep you safe online.");
  addSpacing(3);
  
  addSubheader("Smart AI Companions");
  addText("AI characters assisting humans - intelligent assistants that help you navigate the digital world.");
  addSpacing(3);
  
  addSubheader("Ambassador Opportunity");
  addText("People gaining digital superpowers - join our team and help others achieve digital success.");
  addSpacing(10);

  pdf.addPage();
  yPos = margin;
  
  addHeader("Ambassador Tools");
  addText("Powerful tools at your fingertips to help you succeed as a BitForce Ambassador:");
  addSpacing(5);

  await addImage(toolAiAssistant, "AI Sales Assistant", 100, 60);
  addSpacing(5);
  
  await addImage(toolSecurityCheck, "Security Risk Check", 100, 60);
  addSpacing(5);

  pdf.addPage();
  yPos = margin;
  
  await addImage(toolFriendFinder, "Friend & Family Finder", 100, 60);
  addSpacing(5);
  
  await addImage(toolPropertyLookup, "Property Lookup", 100, 60);
  addSpacing(5);
  
  await addImage(toolIntelligence, "Intelligence Tools", 100, 60);
  addSpacing(10);

  pdf.addPage();
  yPos = margin;
  
  addHeader("Join Our Team");
  addSpacing(3);
  addText("Join our team of AI experts");
  addText("Offer valuable AI tools to your community");
  addText("Network and connect with high-powered AI tools");
  addSpacing(10);

  addHeader("Our Products & Services");
  addText("AI Buddy Services designed to empower your digital journey:");
  addSpacing(8);

  await addImage(productMonthly, "Monthly AI Buddy Subscription - $29/month (Most Popular)", 80, 70);
  addSpacing(5);
  
  await addImage(productOneTime, "One-Time AI Buddy Session - $79 (60 Minutes)", 80, 70);

  pdf.addPage();
  yPos = margin;
  
  await addImage(productBundle, "AI Buddy Bundle Package - $199 (Best Value)", 80, 70);
  addSpacing(5);
  
  await addImage(productScanner, "Digital Footprint Scanner - Included with Plan", 80, 70);
  addSpacing(10);

  checkPageBreak(100);
  addHeader("The Opportunity");
  addText("Join the BitForce Movement. Whether you need protection, AI assistance, or a new digital career path - BitForce empowers your digital future.");
  addSpacing(5);
  
  addSubheader("Earning Potential:");
  addBulletPoint("$50 Referral Bonus");
  addBulletPoint("20% Recurring Override");
  addBulletPoint("$29 To Start");
  addSpacing(10);

  checkPageBreak(60);
  addHeader("Start Your Journey Today");
  addText("Digital Empowerment Partner - Join now and be part of the BitForce family!");
  addSpacing(8);
  
  pdf.setFillColor(79, 70, 229);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Join Now at bitforceambassadorportal.replit.app", pageWidth / 2, yPos + 12, { align: "center" });
  yPos += 30;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(156, 163, 175);
  pdf.text("BitForce - Your Digital Empowerment Partner", pageWidth / 2, pageHeight - 10, { align: "center" });

  pdf.save("BitForce-Explainer.pdf");
}
