from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date
from django.core.mail import EmailMessage
from donate.models import UserRegister
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm


# ---------------------------
# FETCH USER BASIC DETAILS
# ---------------------------
@api_view(["GET"])
def eligibility_user(request, user_id):
    user = get_object_or_404(UserRegister, id=user_id)

    return Response({
        "name": user.name,
        "dob": user.dob,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "blood_group": user.blood_group,
        "last_donated_at": user.last_donated_at,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    })


# ---------------------------
# PDF GENERATION
# ---------------------------
def generate_pdf(data):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 2 * cm

    # ---------- HEADER ----------
    p.setFillColorRGB(0.565, 0, 0)  # #900000 - Red color for LifeFlow
    p.setFont("Helvetica-Bold", 14)
    p.drawCentredString(width / 2, y, "LifeFlow")
    y -= 0.5 * cm

    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica", 10)
    p.drawCentredString(width / 2, y, "Blood Donation & Management System")
    y -= 0.8 * cm

    # Header line
    p.setStrokeColorRGB(0.565, 0, 0)
    p.setLineWidth(1)
    p.line(2 * cm, y, width - 2 * cm, y)
    y -= 1 * cm

    # ---------- DOCUMENT TITLE ----------
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 12)
    p.drawCentredString(width / 2, y, "Blood Donation Eligibility Assessment Report")
    y -= 0.5 * cm
    
    p.setFont("Helvetica", 9)
    p.setFillColorRGB(0.3, 0.3, 0.3)
    p.drawCentredString(width / 2, y, f"Report Date: {date.today().strftime('%d-%m-%Y')}")
    y -= 1 * cm

    # ---------- ASSESSMENT SUMMARY ----------
    status = data.get("Status", "")
    is_eligible = "ELIGIBLE" in status
    
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 11)
    p.drawString(2 * cm, y, "Assessment Summary")
    y -= 0.6 * cm
    
    # Status box
    box_height = 1 * cm
    box_y = y - box_height
    
    if is_eligible:
        p.setFillColorRGB(0.95, 0.98, 0.95)  # Light green background
        p.setStrokeColorRGB(0, 0.5, 0)  # Green border
    else:
        p.setFillColorRGB(1, 0.9, 0.9)  # Light red background
        p.setStrokeColorRGB(0.565, 0, 0)  # Red border #900000
    
    p.setLineWidth(1)
    p.rect(2.5 * cm, box_y, width - 5 * cm, box_height, stroke=1, fill=1)
    
    if is_eligible:
        p.setFillColorRGB(0, 0.5, 0)  # Green text for ELIGIBLE
    else:
        p.setFillColorRGB(0.565, 0, 0)  # Red text #900000 for NOT ELIGIBLE
    
    p.setFont("Helvetica-Bold", 11)
    p.drawCentredString(width / 2, box_y + 0.35 * cm, status)
    
    y = box_y - 0.8 * cm

    # Eligibility message
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica", 10)
    
    if is_eligible:
        message = "You are eligible to donate blood based on the assessment criteria."
    else:
        message = "You are currently not eligible to donate blood. Please review the conditions below."
    
    p.drawString(2.5 * cm, y, message)
    y -= 1.2 * cm

    # ---------- DONOR INFORMATION ----------
    p.setFont("Helvetica-Bold", 11)
    p.drawString(2 * cm, y, "Donor Information")
    y -= 0.5 * cm
    
    p.setStrokeColorRGB(0.7, 0.7, 0.7)
    p.setLineWidth(0.5)
    p.line(2 * cm, y, width - 2 * cm, y)
    y -= 0.6 * cm
    
    # Display donor details
    details_to_show = {k: v for k, v in data.items() 
                      if k not in ["Status", "Remarks"]}
    
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica", 10)
    
    for key, value in details_to_show.items():
        p.setFont("Helvetica-Bold", 10)
        p.drawString(2.5 * cm, y, f"{key}:")
        p.setFont("Helvetica", 10)
        p.drawString(7 * cm, y, str(value))
        y -= 0.6 * cm
    
    y -= 0.4 * cm

    # ---------- ELIGIBILITY CRITERIA ----------
    p.setFont("Helvetica-Bold", 11)
    p.drawString(2 * cm, y, "Eligibility Criteria Checklist")
    y -= 0.5 * cm
    
    p.setStrokeColorRGB(0.7, 0.7, 0.7)
    p.setLineWidth(0.5)
    p.line(2 * cm, y, width - 2 * cm, y)
    y -= 0.6 * cm
    
    p.setFont("Helvetica", 10)
    p.drawString(2.5 * cm, y, "The following criteria were evaluated during this assessment:")
    y -= 0.7 * cm
    
    # Standard criteria
    criteria = [
        "Age: Must be between 18 and 65 years",
        "Weight: Must be at least 50 kg",
        "Hemoglobin: Must be at least 12.5 g/dL",
        "Medications: No recent medications that affect donation",
        "Tattoo/Piercing: None in the last 6 months",
        "Medical History: No major illness that prevents donation"
    ]
    
    for criterion in criteria:
        p.drawString(3 * cm, y, f"• {criterion}")
        y -= 0.6 * cm
    
    y -= 0.4 * cm

    # ---------- REMARKS/CONDITIONS ----------
    remarks = data.get("Remarks", "")
    
    if remarks and remarks != "All conditions satisfied":
        p.setFont("Helvetica-Bold", 11)
        p.drawString(2 * cm, y, "Conditions Affecting Eligibility")
        y -= 0.5 * cm
        
        p.setStrokeColorRGB(0.7, 0.7, 0.7)
        p.setLineWidth(0.5)
        p.line(2 * cm, y, width - 2 * cm, y)
        y -= 0.6 * cm
        
        p.setFillColorRGB(0.4, 0, 0)
        p.setFont("Helvetica", 10)
        p.drawString(2.5 * cm, y, "The following conditions were identified:")
        y -= 0.7 * cm
        
        p.setFillColorRGB(0, 0, 0)
        remark_lines = remarks.split(" | ")
        for remark in remark_lines:
            p.drawString(3 * cm, y, f"• {remark}")
            y -= 0.6 * cm
        
        y -= 0.4 * cm
    else:
        p.setFont("Helvetica-Bold", 11)
        p.drawString(2 * cm, y, "Assessment Result")
        y -= 0.5 * cm
        
        p.setStrokeColorRGB(0.7, 0.7, 0.7)
        p.setLineWidth(0.5)
        p.line(2 * cm, y, width - 2 * cm, y)
        y -= 0.6 * cm
        
        p.setFillColorRGB(0, 0.4, 0)
        p.setFont("Helvetica", 10)
        p.drawString(2.5 * cm, y, "✓ All eligibility criteria have been successfully met.")
        y -= 0.6 * cm
        
        p.setFillColorRGB(0, 0, 0)
        p.drawString(2.5 * cm, y, "✓ No medical conditions that would prevent blood donation.")
        y -= 1 * cm

    # ---------- IMPORTANT NOTES ----------
    p.setFont("Helvetica-Bold", 11)
    p.drawString(2 * cm, y, "Important Information")
    y -= 0.5 * cm
    
    p.setStrokeColorRGB(0.7, 0.7, 0.7)
    p.setLineWidth(0.5)
    p.line(2 * cm, y, width - 2 * cm, y)
    y -= 0.6 * cm
    
    p.setFont("Helvetica", 9)
    notes = [
        "• This report is valid for blood donation requests within 30 days from the date of generation.",
        "• Please present this report when requesting to donate blood at any blood bank or donation center.",
        "• Final eligibility will be confirmed by medical staff at the donation center.",
        "• Ensure you are well-hydrated and have eaten before donating blood.",
        "• If your health status changes, please inform the medical staff before donation."
    ]
    
    for note in notes:
        p.drawString(2.5 * cm, y, note)
        y -= 0.5 * cm

    # ---------- FOOTER ----------
    y = 2.5 * cm
    
    p.setStrokeColorRGB(0.565, 0, 0)
    p.setLineWidth(0.5)
    p.line(2 * cm, y, width - 2 * cm, y)
    y -= 0.5 * cm
    
    p.setFillColorRGB(0.4, 0.4, 0.4)
    p.setFont("Helvetica", 8)
    p.drawCentredString(width / 2, y, "LifeFlow Blood Donation System • Save Lives Through Blood Donation")
    y -= 0.4 * cm
    
    p.setFont("Helvetica", 7)
    p.drawCentredString(width / 2, y, "This is an automatically generated report. For support, contact: support@lifeflow.com")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer


# ---------------------------
# ELIGIBILITY CHECK
# ---------------------------
@api_view(["POST"])
def check_eligibility(request):
    try:
        data = request.data

        user_id = data.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        user = get_object_or_404(UserRegister, id=user_id)

        reasons = []
        eligible = True
        today = date.today()

        dob = date.fromisoformat(data.get("dob"))
        weight = float(data.get("weight"))
        hemoglobin = float(data.get("hemoglobin"))

        medications = str(data.get("medications")).lower()
        tattoo = str(data.get("tattoo")).lower()
        illness = str(data.get("illness")).lower()
        
        def is_yes(value):
            return value in [True, "true", "True", "yes", "Yes", "YES", "1", 1, "on"]

        # AGE
        age = today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )
        if age < 18 or age > 65:
            eligible = False
            reasons.append("Age must be between 18 and 65")

        # WEIGHT
        if weight < 50:
            eligible = False
            reasons.append("Weight must be at least 50 kg")

        # HEMOGLOBIN
        if hemoglobin < 12.5:
            eligible = False
            reasons.append("Hemoglobin must be at least 12.5 g/dL")

        # QUESTIONNAIRE (STRICT)
        if is_yes(medications):
            eligible = False
            reasons.append("Recent medication taken")

        if is_yes(tattoo):
            eligible = False
            reasons.append("Tattoo or piercing in last 6 months")

        if is_yes(illness):
            eligible = False
            reasons.append("History of major illness")

        pdf_data = {
            "Name": user.name,
            "Age": age,
            "Gender": user.gender,
            "Blood Group": user.blood_group,
            "Phone": user.phone,
            "Weight": f"{weight} kg",
            "Hemoglobin": f"{hemoglobin} g/dL",
            "Status": "ELIGIBLE" if eligible else "NOT ELIGIBLE",
            "Remarks": " | ".join(reasons) if reasons else "All conditions satisfied",
        }

        pdf = generate_pdf(pdf_data)

        email = EmailMessage(
            subject="LifeFlow Blood Donation Eligibility Report",
            body=(
                "Dear Donor,\n\n"
                "Thank you for completing your blood donation eligibility assessment with LifeFlow.\n\n"
                "Please find attached your official eligibility assessment report. "
                "This document contains your assessment results and important information regarding your eligibility to donate blood.\n\n"
                "IMPORTANT: Please keep this report and attach it when requesting to donate blood at any blood bank or donation center. "
                "The medical staff will review this report along with their own assessment before proceeding with the donation.\n\n"
                "This report is valid for 30 days from the date of generation.\n\n"
                "If you have any questions or need assistance, please don't hesitate to contact us at support@lifeflow.com\n\n"
                "Thank you for choosing LifeFlow and for your commitment to saving lives through blood donation.\n\n"
                "Best Regards,\n"
                "LifeFlow Team\n"
                "Blood Donation & Management System"
            ),
            from_email="lifelow.noreply@gmail.com",
            to=[data.get("email")],
        )

        email.attach("LifeFlow_Eligibility_Report.pdf", pdf.read(), "application/pdf")
        email.send()

        return Response({
            "eligible": eligible,
            "age": age,
            "reasons": reasons,
            "message": "Eligibility report sent to your email."
        })

    except Exception as e:
        return Response(
            {"error": "Invalid data", "details": str(e)},
            status=400
        )