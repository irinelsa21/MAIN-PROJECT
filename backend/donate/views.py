from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import (
    ApprovedUserSerializer, RegistrationRequestSerializer, UserRegisterSerializer, 
    AnnouncementSerializer, HelpQuerySerializer, DonorSerializer, BloodRequestSerializer, 
    UserProfileSerializer, FeedbackSerializer
)
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count, Max
from django.db.models.functions import TruncDate
from .models import Announcement, UserRegister, Donor, BloodRequest, Assignment, HelpQuery, Feedback
from django.http import HttpResponse
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from .models import Assignment





from .models import UserRegister

@api_view(["POST"])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    # ---------------- BASIC VALIDATION ----------------
    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------------- ADMIN LOGIN ----------------
    try:
        admin = User.objects.get(email=email)
        user = authenticate(
            username=admin.username,
            password=password
        )

        if user is not None and user.is_superuser:
            return Response({
                "role": "admin",
                "message": "Admin login successful"
            }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        pass  # Not admin → continue user login

    # ---------------- USER LOGIN ----------------
    try:
        user = UserRegister.objects.get(email=email)

        if user.status == "PENDING":
            return Response(
                {"error": "Admin approval pending"},
                status=status.HTTP_403_FORBIDDEN
            )

        if user.status == "REJECTED":
            return Response(
                {"error": "Your account was rejected by admin"},
                status=status.HTTP_403_FORBIDDEN
            )

        if check_password(password, user.password):
            return Response({
                "role": "user",
                "message": "Login successful",
                "user_id": user.id
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    except UserRegister.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
@api_view(["GET"])
def check_email_availability(request):
    email = request.GET.get("email")
    if not email:
        return Response({"error": "Email required"}, status=400)
    
    exists = UserRegister.objects.filter(email=email).exists()
    return Response({"available": not exists})

@api_view(["GET"])
def get_user_profile(request):
    """
    Fetch logged-in user's name and blood group
    """
    email = request.GET.get("email")  # email passed from frontend

    try:
        profile = UserRegister.objects.get(email=email)

        return Response({
            "name": profile.name,
            "blood_group": profile.blood_group
        })
    except UserRegister.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
    
    



class UserProfileView(APIView):

    def get(self, request, user_id):
        try:
            user = UserRegister.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except UserRegister.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    def put(self, request, user_id):
        try:
            user = UserRegister.objects.get(id=user_id)
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except UserRegister.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
class DeleteUserView(APIView):
    def delete(self, request, user_id):
        try:
            user = UserRegister.objects.get(id=user_id)
            user.delete()
            return Response(
                {"message": "Account deleted successfully"},
                status=status.HTTP_200_OK
            )
        except UserRegister.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
@api_view(["GET"])
def registration_requests(request):
    """
    Fetch ALL registration requests for admin
    """
    users = UserRegister.objects.all().order_by("-requested_at")
    serializer = RegistrationRequestSerializer(users, many=True)
    return Response(serializer.data)

from rest_framework import status

@api_view(["POST"])
def update_user_status(request, user_id):
    try:
        user = UserRegister.objects.get(id=user_id)
        action = request.data.get("action")

        if action == "approve":
            user.status = "APPROVED"
        elif action == "reject":
            user.status = "REJECTED"
        else:
            return Response({"error": "Invalid action"}, status=400)

        user.save()

        return Response({"message": "Status updated"}, status=200)

    except UserRegister.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
@api_view(["GET"])
def approved_users(request):
    users = UserRegister.objects.filter(status="APPROVED").order_by("-register_time")
    serializer = ApprovedUserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
def delete_user(request, user_id):
    try:
        user = UserRegister.objects.get(id=user_id, status="APPROVED")
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_200_OK
        )
    except UserRegister.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(["POST"])
def create_announcement(request):
    serializer = AnnouncementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def active_announcements(request):
    today = timezone.now().date()
    announcements = Announcement.objects.filter(expiry_date__gte=today).order_by("-created_at")
    serializer = AnnouncementSerializer(announcements, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def all_announcements(request):
    announcements = Announcement.objects.all().order_by("-created_at")
    serializer = AnnouncementSerializer(announcements, many=True)
    return Response(serializer.data)

@api_view(["PUT"])
def update_announcement(request, id):
    try:
        ann = Announcement.objects.get(id=id)
    except Announcement.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = AnnouncementSerializer(ann, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
def delete_announcement(request, id):
    try:
        ann = Announcement.objects.get(id=id)
        ann.delete()
        return Response({"message": "Deleted"}, status=200)
    except Announcement.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(["GET"])
def user_announcements(request):
    today = timezone.now().date()

    # 🔥 AUTO DELETE EXPIRED ANNOUNCEMENTS
    Announcement.objects.filter(expiry_date__lt=today).delete()

    # Fetch only valid announcements
    announcements = Announcement.objects.filter(expiry_date__gte=today).order_by("-created_at")

    serializer = AnnouncementSerializer(announcements, many=True)
    return Response(serializer.data)



# ✅ CREATE QUERY

@api_view(["POST"])
def create_help_query(request):
    user_id = request.data.get("user_id")
    question = request.data.get("question")

    HelpQuery.objects.create(
        user_id=user_id,
        question=question
    )

    return Response({"message": "Query submitted"})

# ✅ MY QUERIES
@api_view(["GET"])
def my_help_queries(request):
    user_id = request.GET.get("user_id")

    queries = HelpQuery.objects.filter(user_id=user_id).order_by("-created_at")
    serializer = HelpQuerySerializer(queries, many=True)

    return Response(serializer.data)




# ✅ DELETE QUERY
@api_view(["DELETE"])
def delete_help_query(request, query_id):
    try:
        query = HelpQuery.objects.get(id=query_id)
        query.delete()

        return Response({"message": "Deleted"})
    except HelpQuery.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(["GET"])
def admin_help_queries(request):
    queries = HelpQuery.objects.all().order_by("-created_at")
    serializer = HelpQuerySerializer(queries, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def admin_reply_query(request, query_id):
    try:
        query = HelpQuery.objects.get(id=query_id)

        answer = request.data.get("answer")

        if not answer:
            return Response({"error": "Answer required"}, status=400)

        query.answer = answer
        query.replied_at = timezone.now()
        query.save()

        query.save()

        return Response({"message": "Reply saved"})

    except HelpQuery.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    
@api_view(["POST"])
def react_to_reply(request):
    query_id = request.data.get("query_id")
    reaction = request.data.get("reaction")

    try:
        q = HelpQuery.objects.get(id=query_id)
        q.reaction = reaction
        q.save()

        return Response({"message": "Reaction saved"})
    except:
        return Response({"error": "Not found"}, status=404)

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from donate.models import UserRegister
from .models import Donor



# 🔹 Fetch user details from UserRegister
@api_view(["GET"])
def donor_user(request, user_id):
    user = UserRegister.objects.get(id=user_id)

    return Response({
        "name": user.name,
        "dob": user.dob,
        "gender": user.gender,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "district": user.district,
        "blood_group": user.blood_group,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    })


# 🔹 Submit donor form
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_donor(request):
    user_id = request.data.get("user")
    user = UserRegister.objects.get(id=user_id)


    serializer = DonorSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Donor request submitted"})

    return Response(serializer.errors, status=400)


# 🔹 Fetch user's donor requests
@api_view(["GET"])
def my_donations(request, user_id):
    donors = Donor.objects.filter(user_id=user_id).order_by("-id")

    data = []
    for d in donors:
        data.append({
            "id": d.id,
            "name": d.name,
            "blood_group": d.blood_group,
            "district": d.district,
            "available_districts": d.available_districts,
            "status": d.status,
            "is_available": d.is_available,
            "created_at": d.created_at
        })

    return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Donor

# 🔹 FETCH ALL DONORS (ADMIN)
@api_view(["GET"])
def admin_donor_list(request):
    donors = Donor.objects.all().order_by("-created_at")

    data = []
    for d in donors:
        data.append({
            "id": d.id,
            "name": d.name,
            "dob": d.dob,
            "gender": d.gender,
            "blood_group": d.blood_group,
            "email": d.email,
            "phone": d.phone,
            "address": d.address,
            "district": d.district,
            "available_districts": d.available_districts,
            "status": d.status,
            "confirmation_file": d.confirmation_file.url if d.confirmation_file else None,
            "created_at": d.created_at,
        })

    return Response(data)


# 🔹 APPROVE / REJECT DONOR
@api_view(["POST"])
def admin_update_donor_status(request, donor_id):
    try:
        donor = Donor.objects.get(id=donor_id)
    except Donor.DoesNotExist:
        return Response({"error": "Donor not found"}, status=404)

    status_value = request.data.get("status")

    if status_value not in ["APPROVED", "REJECTED"]:
        return Response({"error": "Invalid status"}, status=400)

    donor.status = status_value
    donor.save()

    # If donor is APPROVED, mark all previous assignments of this user as False (available)
    if status_value == "APPROVED":
        Assignment.objects.filter(donor__user=donor.user, status=True).update(status=False)

    return Response({"message": f"Donor {status_value}"})



from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http import JsonResponse
from .models import UserRegister, BloodRequest



# 🔹 FETCH USER NAME & PHONE
@api_view(["GET"])
def blood_request_user(request, user_id):
    user = UserRegister.objects.get(id=user_id)
    return Response({
        "name": user.name,
        "phone": user.phone,
        "blood_group": user.blood_group,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    })


# 🔹 SUBMIT BLOOD REQUEST
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_blood_request(request):
    serializer = BloodRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Submitted"})
    return Response(serializer.errors, status=400)


# 🔹 FETCH USER REQUEST HISTORY
@api_view(["GET"])
def my_blood_requests(request, user_id):
    requests = BloodRequest.objects.filter(user_id=user_id).order_by("-id")

    data = []
    for r in requests:
        data.append({
            "id": r.id,
            "patient_name": r.patient_name,
            "blood_group": r.blood_group,
            "blood_component": r.blood_component,
            "hospital_name": r.hospital_name,
            "hospital_date": r.hospital_date,
            "district": r.district,
            "status": r.status,
            "created_at": r.created_at,
        })

    return JsonResponse(data, safe=False)

@api_view(["GET"])
def admin_blood_requests(request):
    requests = BloodRequest.objects.select_related("user").order_by("-id")

    data = []
    for r in requests:
        assigned_donors = Assignment.objects.filter(blood_request=r).count()
        data.append({
            "id": r.id,
            "assigned_count": assigned_donors,
            "is_fulfilled": r.is_fulfilled,

            # USER DETAILS
            "user_name": r.requester_name,
            "user_phone": r.requester_phone,

            # PATIENT DETAILS
            "patient_name": r.patient_name,
            "patient_dob": r.patient_dob,
            "gender": r.gender,
            "blood_group": r.blood_group,
            "blood_component": r.blood_component,
            "address": r.address,
            "email": r.email,
            "phone": r.phone,
            "district": r.district,
            "relative_phone": r.relative_phone,

            # HOSPITAL DETAILS
            "hospital_name": r.hospital_name,
            "hospital_date": r.hospital_date,
            "hospital_ip_number": r.hospital_ip_number,

            # FILE
            "id_proof": r.id_proof.url if r.id_proof else None,

            # STATUS
            "status": r.status,
            "created_at": r.created_at,
        })

    return JsonResponse(data, safe=False)

@api_view(["POST"])
def mark_blood_request_seen(request, request_id):
    try:
        blood_request = BloodRequest.objects.get(id=request_id)
        blood_request.status = "SEEN"
        blood_request.save()
        return Response({"message": "Marked as seen"})
    except BloodRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=404)



BLOOD_COMPATIBILITY = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
}
# donate/views.py
from donate.models import Donor, BloodRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def get_compatible_donors(request, request_id):
    blood_request = BloodRequest.objects.get(id=request_id)
    patient_bg = blood_request.blood_group.upper()

    
    compatible_types = [
        donor_bg for donor_bg, can_give in BLOOD_COMPATIBILITY.items()
        if patient_bg in can_give
    ]
    print(f"DEBUG: Request {request_id}, Patient BG: {patient_bg}")
    print(f"DEBUG: Compatible Donor Types: {compatible_types}")

    # Get IDs of donors who are currently assigned (status=True)
    active_donor_ids = Assignment.objects.filter(status=True).values_list('donor_id', flat=True)

    # Get the latest APPROVED donor record for each user
    latest_approved_ids = Donor.objects.filter(status="APPROVED")\
        .values('user_id')\
        .annotate(latest_id=Max('id'))\
        .values_list('latest_id', flat=True)

    compatible_donors = Donor.objects.filter(
        id__in=latest_approved_ids,
        blood_group__in=compatible_types
    ).exclude(id__in=active_donor_ids)
    
    print(f"DEBUG: Found {compatible_donors.count()} available approved donors (latest requests only)")


    data = []
    for d in compatible_donors:
        data.append({
            "id": d.id,
            "name": d.name,
            "blood_group": d.blood_group,
            "phone": d.phone,
            "email": d.email,
            "district": d.district,
        })

    return Response(data)

@api_view(["POST"])
def assign_donors(request, request_id):
    donor_ids = request.data.get("donors", [])

    if not donor_ids:
        return Response({"error": "No donors selected"}, status=400)

    blood_request = BloodRequest.objects.get(id=request_id)
    donors = Donor.objects.filter(id__in=donor_ids)

    try:
        # ---- EMAIL TO PATIENT ----
        donor_details = "\n".join([
            f"- {d.name} ({d.blood_group}) | Phone: {d.phone} | District: {d.district}"
            for d in donors
        ])

        send_mail(
            subject="Important: Donor Assignment for Your Blood Request - LifeFlow",
            message=(
                f"Dear {blood_request.patient_name},\n\n"
                f"This is an official notification from LifeFlow regarding your blood request. "
                f"We have successfully assigned compatible donor(s) to assist with your requirement.\n\n"
                f"Requirement Details:\n"
                f"- Blood Group: {blood_request.blood_group}\n"
                f"- Component: {blood_request.blood_component}\n"
                f"- Hospital: {blood_request.hospital_name}\n"
                f"- Requirement Date: {blood_request.hospital_date.strftime('%d-%m-%Y')}\n\n"
                f"Assigned Donor Information:\n"
                f"{donor_details}\n\n"
                f"Important Instructions:\n"
                f"- The assigned donor(s) are expected to arrive at the hospital by the morning of {blood_request.hospital_date.strftime('%d-%m-%Y')}.\n"
                f"- We recommend contacting the donor(s) immediately to coordinate the donation process.\n"
                f"- Please ensure you have all necessary documentation ready at the hospital.\n\n"
                f"Thank you for trusting LifeFlow. We wish you a speedy recovery.\n\n"
                f"Best regards,\n"
                f"The LifeFlow Team"
            ),
            from_email="lifelow.noreply@gmail.com",
            recipient_list=[blood_request.email],
            fail_silently=False
        )

        # ---- EMAIL TO DONORS ----
        for d in donors:
            try:
                send_mail(
                    subject="Urgent: Blood Donation Assignment - LifeFlow",
                    message=(
                        f"Dear {d.name},\n\n"
                        f"Thank you for your noble commitment to saving lives. You have been assigned to a "
                        f"critical blood request that matches your profile.\n\n"
                        f"Patient & Requirement Details:\n"
                        f"- Patient Name: {blood_request.patient_name}\n"
                        f"- Required Blood Group: {blood_request.blood_group}\n"
                        f"- Blood Component: {blood_request.blood_component}\n"
                        f"- Hospital: {blood_request.hospital_name}\n"
                        f"- Hospital District: {blood_request.district}\n"
                        f"- Required Date: {blood_request.hospital_date.strftime('%d-%m-%Y')}\n\n"
                        f"Contact Information:\n"
                        f"- Primary Contact: {blood_request.requester_name}\n"
                        f"- Phone Number: {blood_request.requester_phone}\n\n"
                        f"Action Required:\n"
                        f"- Please contact the requester as soon as possible to confirm your availability.\n"
                        f"- Plan your visit to {blood_request.hospital_name} for the morning of {blood_request.hospital_date.strftime('%d-%m-%Y')}.\n"
                        f"- Remember to carry a valid ID and ensure you have had adequate rest and hydration before donating.\n\n"
                        f"Your contribution makes a life-saving difference. Thank you for being a hero.\n\n"
                        f"Best regards,\n"
                        f"The LifeFlow Team\n"
                        f"LifeFlow Administration"
                    ),
                    from_email="lifelow.noreply@gmail.com",
                    recipient_list=[d.user.email],  # Using donor's email directly
                    fail_silently=False
                )
            except Exception as e:
                print(f"Error sending email to donor {d.email}: {e}")

    except Exception as e:
        return Response({"error": f"Patient email failed: {str(e)}"}, status=500)

    # ---- CREATE ASSIGNMENTS ----
    for d in donors:
        Assignment.objects.create(donor=d, blood_request=blood_request, status=True)
        # No longer locking donors: d.is_available = False removed

    blood_request.status = "SEEN"
    blood_request.save()

    return Response({"message": "Donors assigned successfully"})


@api_view(["GET"])
def get_assigned_donors(request, request_id):
    assignments = Assignment.objects.filter(blood_request_id=request_id)
    data = []
    for a in assignments:
        data.append({
            "id": a.donor.id,
            "name": a.donor.name,
            "blood_group": a.donor.blood_group,
            "phone": a.donor.phone,
            "district": a.donor.district,
        })
    return Response(data)

@api_view(["POST"])
def submit_assignment(request, request_id):
    blood_request = BloodRequest.objects.get(id=request_id)
    
    # Check if at least one donor is assigned
    assignments = Assignment.objects.filter(blood_request=blood_request)
    if not assignments.exists():
        return Response({"error": "No donors assigned yet"}, status=400)

    # Mark request as fulfilled
    blood_request.is_fulfilled = True
    blood_request.save()

    # Update last_donated_at for all assigned donors
    last_donation_date = blood_request.hospital_date
    for assign in assignments:
        donor_user = assign.donor.user
        donor_user.last_donated_at = last_donation_date
        donor_user.save()
    
    return Response({"message": "Request submitted successfully"})

@api_view(["GET"])
def admin_all_assignments(request):
    assignments = Assignment.objects.select_related('donor', 'blood_request').all().order_by('-assigned_at')
    data = []
    for a in assignments:
        data.append({
            "id": a.id,
            "assigned_at": a.assigned_at,
            "donor": {
                "id": a.donor.id,
                "name": a.donor.name,
                "blood_group": a.donor.blood_group,
                "phone": a.donor.phone,
                "district": a.donor.district,
            },
            "patient": {
                "id": a.blood_request.id,
                "name": a.blood_request.patient_name,
                "blood_group": a.blood_request.blood_group,
                "hospital": a.blood_request.hospital_name,
                "hospital_date": a.blood_request.hospital_date,
            }
        })
    return Response(data)

# 🔹 User Assignment History
@api_view(["GET"])
def user_assignment_history(request, user_id):
    assignments = Assignment.objects.filter(donor__user_id=user_id).select_related('donor', 'blood_request').order_by('-assigned_at')
    
    data = []
    for a in assignments:
        data.append({
            "id": a.id,
            "assigned_at": a.assigned_at,
            "patient_name": a.blood_request.patient_name,
            "blood_group": a.blood_request.blood_group,
            "hospital_name": a.blood_request.hospital_name,
            "hospital_address": a.blood_request.address,
            "district": a.blood_request.district,
            "required_date": a.blood_request.hospital_date,
            "requester_name": a.blood_request.requester_name,
            "requester_phone": a.blood_request.requester_phone,
            "status": a.blood_request.status,
            "is_fulfilled": a.blood_request.is_fulfilled
        })
    return Response(data)

# 🔹 Admin Statistics
@api_view(["GET"])
def admin_statistics(request):
    # Summary Statistics
    total_users = UserRegister.objects.count()
    approved_users = UserRegister.objects.filter(status="APPROVED").count()
    total_donors = Donor.objects.count()
    approved_donors = Donor.objects.filter(status="APPROVED").count()
    total_requests = BloodRequest.objects.count()
    total_assignments = Assignment.objects.count()
    total_announcements = Announcement.objects.count()
    
    # Registration Trends (Last 30 days)
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    
    user_trends = UserRegister.objects.filter(register_time__gte=thirty_days_ago) \
        .annotate(date=TruncDate('register_time')) \
        .values('date') \
        .annotate(count=Count('id')) \
        .order_by('date')
        
    donor_trends = Donor.objects.filter(created_at__gte=thirty_days_ago) \
        .annotate(date=TruncDate('created_at')) \
        .values('date') \
        .annotate(count=Count('id')) \
        .order_by('date')

    # Blood Group Distribution
    # Note: Use specific fields to avoid issues with missing fields
    donor_groups = Donor.objects.values('blood_group').annotate(count=Count('id'))
    request_groups = BloodRequest.objects.values('blood_group').annotate(count=Count('id'))
    
    # Request Status
    request_status = BloodRequest.objects.values('is_fulfilled').annotate(count=Count('id'))
    
    # Format data for charts
    formatted_trends = {}
    for entry in user_trends:
        date_str = entry['date'].strftime('%Y-%m-%d')
        formatted_trends[date_str] = {'date': date_str, 'users': entry['count'], 'donors': 0}
        
    for entry in donor_trends:
        date_str = entry['date'].strftime('%Y-%m-%d')
        if date_str in formatted_trends:
            formatted_trends[date_str]['donors'] = entry['count']
        else:
            formatted_trends[date_str] = {'date': date_str, 'users': 0, 'donors': entry['count']}
            
    trend_list = sorted(formatted_trends.values(), key=lambda x: x['date'])

    # Pending Counts for Notifications
    pending_registrations = UserRegister.objects.filter(status="PENDING").count()
    pending_donors = Donor.objects.filter(status="PENDING").count()
    new_blood_requests = BloodRequest.objects.filter(status="NOT_SEEN").count()
    pending_queries = HelpQuery.objects.filter(answer__isnull=True).count()
    pending_feedbacks = Feedback.objects.filter(is_approved=False).count()

    # Recent Activities Aggregation
    recent_activities = []
    
    # Recent Approved Users
    last_users = UserRegister.objects.filter(status="APPROVED").order_by('-register_time')[:5]
    for u in last_users:
        recent_activities.append({
            "type": "user",
            "text": f"New user approved: {u.name}",
            "time": u.register_time.isoformat()
        })
        
    # Recent Blood Requests
    last_requests = BloodRequest.objects.order_by('-created_at')[:5]
    for r in last_requests:
        recent_activities.append({
            "type": "request",
            "text": f"Blood request: {r.blood_group} for {r.patient_name}",
            "time": r.created_at.isoformat()
        })
        
    # Recent Donor Assignments
    last_assignments = Assignment.objects.all().order_by('-assigned_at')[:5]
    for a in last_assignments:
        recent_activities.append({
            "type": "assignment",
            "text": f"Matched {a.donor.name} with {a.blood_request.patient_name}",
            "time": a.assigned_at.isoformat()
        })
        
    # Recent Announcements
    last_announcements = Announcement.objects.all().order_by('-created_at')[:5]
    for an in last_announcements:
        recent_activities.append({
            "type": "announcement",
            "text": f"Announcement: {an.title}",
            "time": an.created_at.isoformat()
        })

    # Recent Feedbacks
    last_feedbacks = Feedback.objects.all().order_by('-created_at')[:5]
    for fb in last_feedbacks:
        recent_activities.append({
            "type": "feedback",
            "text": f"New feedback from {fb.name} ({fb.rating} stars)",
            "time": fb.created_at.isoformat()
        })
        
    # Sort all activities by time descending and take top 5
    recent_activities.sort(key=lambda x: x['time'], reverse=True)
    recent_activities = recent_activities[:5]

    return Response({
        "summary": {
            "totalUsers": total_users,
            "approvedUsers": approved_users,
            "totalDonors": total_donors,
            "approvedDonors": approved_donors,
            "totalRequests": total_requests,
            "totalAssignments": total_assignments,
            "totalAnnouncements": total_announcements
        },
        "pendingCounts": {
            "registration": pending_registrations,
            "donors": pending_donors,
            "requests": new_blood_requests,
            "queries": pending_queries,
            "feedbacks": pending_feedbacks
        },
        "recentActivities": recent_activities,
        "registrationTrends": trend_list,
        "bloodGroupDistribution": {
            "donors": list(donor_groups),
            "requests": list(request_groups)
        },
        "fulfillmentStatus": list(request_status)
    })


@api_view(["GET"])
def download_users_report(request):
    users = UserRegister.objects.filter(status="APPROVED")
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=50, bottomMargin=50)
    elements = []
    
    styles = getSampleStyleSheet()
    
    # --- HEADER SECTION ---
    header_style = styles['Heading1']
    header_style.textColor = colors.HexColor("#900000")
    header_style.fontSize = 28
    header_style.alignment = 1
    elements.append(Paragraph("LifeFlow", header_style))
    
    sub_header_style = styles['Normal']
    sub_header_style.alignment = 1
    sub_header_style.textColor = colors.gray
    elements.append(Paragraph("Blood Donation Management System", sub_header_style))
    
    elements.append(Spacer(1, 10))
    # Horizontal line
    elements.append(Table([[""]], colWidths=[480], style=[
        ('LINEBELOW', (0,0), (-1,0), 1.5, colors.HexColor("#900000")),
        ('TOPPADDING', (0,0), (-1,0), 0),
        ('BOTTOMPADDING', (0,0), (-1,0), 0),
    ]))
    elements.append(Spacer(1, 20))
    
    # Document Title
    doc_title_style = styles['Heading2']
    doc_title_style.alignment = 0
    doc_title_style.fontSize = 16
    elements.append(Paragraph("Approved Users Directory", doc_title_style))
    elements.append(Spacer(1, 12))
    
    # --- TABLE SECTION ---
    data = [["ID", "Name", "Group", "Phone", "District", "Email"]]
    for user in users:
        data.append([
            f"#{user.id}",
            user.name,
            user.blood_group,
            user.phone,
            user.district,
            user.email
        ])
        
    t = Table(data, colWidths=[40, 100, 50, 80, 80, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#900000")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9FA")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#DEE2E6")),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(t)
    
    # --- FOOTER ---
    elements.append(Spacer(1, 40))
    ts = timezone.now().strftime("%d %b %Y, %H:%M")
    footer_text = f"Report generated on: {ts} | Lifeflow Administration Center"
    elements.append(Paragraph(footer_text, styles['Italic']))
    
    doc.build(elements)
    
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="LifeFlow_User_Report.pdf"'
    return response


@api_view(["GET"])
def download_assignments_report(request):
    assignments = Assignment.objects.all().order_by('-assigned_at')
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=50, bottomMargin=50)
    elements = []
    
    styles = getSampleStyleSheet()
    
    # --- HEADER SECTION ---
    header_style = styles['Heading1']
    header_style.textColor = colors.HexColor("#900000")
    header_style.fontSize = 28
    header_style.alignment = 1
    elements.append(Paragraph("LifeFlow", header_style))
    
    sub_header_style = styles['Normal']
    sub_header_style.alignment = 1
    sub_header_style.textColor = colors.gray
    elements.append(Paragraph("Blood Donation & Matching Registry", sub_header_style))
    
    elements.append(Spacer(1, 10))
    elements.append(Table([[""]], colWidths=[480], style=[
        ('LINEBELOW', (0,0), (-1,0), 1.5, colors.HexColor("#900000")),
        ('TOPPADDING', (0,0), (-1,0), 0),
        ('BOTTOMPADDING', (0,0), (-1,0), 0),
    ]))
    elements.append(Spacer(1, 20))
    
    # Document Title
    doc_title_style = styles['Heading2']
    doc_title_style.alignment = 0
    doc_title_style.fontSize = 16
    elements.append(Paragraph("Donor Assignment History", doc_title_style))
    elements.append(Spacer(1, 12))
    
    data = [["ID", "Donor Name", "Grp", "Beneficiary", "Hospital", "Assignment Date"]]
    for item in assignments:
        data.append([
            f"#{item.id}",
            item.donor.name,
            item.donor.blood_group,
            item.blood_request.patient_name,
            item.blood_request.hospital_name,
            item.assigned_at.strftime('%d-%m-%Y')
        ])
        
    t = Table(data, colWidths=[40, 100, 40, 110, 100, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#900000")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9FA")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#DEE2E6")),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(t)
    
    # --- FOOTER ---
    elements.append(Spacer(1, 40))
    ts = timezone.now().strftime("%d %b %Y, %H:%M")
    footer_text = f"Confidential Report | Generated on: {ts} | Lifeflow Matching System"
    elements.append(Paragraph(footer_text, styles['Italic']))
    
    doc.build(elements)
    
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="LifeFlow_Assignments_Report.pdf"'
    return response


@api_view(["GET"])
def user_dashboard_stats(request, user_id):
    try:
        user = UserRegister.objects.get(id=user_id)

        # Total Donations: Count fulfilled assignments for this user's donor records
        total_donations = Assignment.objects.filter(
            donor__user=user, 
            blood_request__is_fulfilled=True
        ).count()

        # Lives Saved: Standard estimate (1 donation saves 3 lives)
        lives_saved = total_donations * 3

        # Eligibility: 90 days after last donation
        next_eligible = "Eligible Now"
        if user.last_donated_at:
            delta = timezone.now().date() - user.last_donated_at
            if delta.days < 90:
                days_left = 90 - delta.days
                next_eligible = f"{days_left} days"

        return Response({
            "total_donations": total_donations,
            "lives_saved": lives_saved,
            "next_eligible": next_eligible
        })
    except UserRegister.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# 🔹 Public Home Page Data (Stats + Announcements)
@api_view(["GET"])
@permission_classes([AllowAny])
def public_home_data(request):
    """
    Fetch stats and active announcements for the home page.
    """
    # 1. Stats
    approved_donors = Donor.objects.filter(status="APPROVED").count()
    fulfilled_requests = BloodRequest.objects.filter(is_fulfilled=True).count()
    lives_saved = fulfilled_requests * 3

    # 2. Announcements
    today = timezone.now().date()
    # Fetch top 3 active announcements
    active_anns = Announcement.objects.filter(expiry_date__gte=today).order_by("-created_at")[:3]
    ann_serializer = AnnouncementSerializer(active_anns, many=True)

    # 3. Feedbacks (Approved)
    approved_feedbacks = Feedback.objects.filter(is_approved=True).order_by("-created_at")[:5]
    feedback_serializer = FeedbackSerializer(approved_feedbacks, many=True)

    return Response({
        "stats": {
            "donors": approved_donors,
            "donations": fulfilled_requests,
            "lives": lives_saved,
            "total_savers": approved_donors,
            "satisfaction_rate": 98.6  # High quality constant for now
        },
        "announcements": ann_serializer.data,
        "feedbacks": feedback_serializer.data
    })

# 🔹 Feedback Submission
@api_view(["POST"])
@permission_classes([AllowAny])
def submit_feedback(request):
    """
    Allow anyone to submit feedback.
    """
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Feedback submitted successfully. It will be visible once approved."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🔹 Admin Feedback Management
@api_view(["GET"])
def admin_get_feedbacks(request):
    """
    Get all feedbacks for admin management.
    """
    feedbacks = Feedback.objects.all().order_by("-created_at")
    serializer = FeedbackSerializer(feedbacks, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def admin_update_feedback_status(request, feedback_id):
    """
    Approve or Hide feedback.
    """
    try:
        feedback = Feedback.objects.get(id=feedback_id)
        feedback.is_approved = request.data.get("is_approved", feedback.is_approved)
        feedback.save()
        return Response({"message": "Status updated successfully"})
    except Feedback.DoesNotExist:
        return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["DELETE"])
def admin_delete_feedback(request, feedback_id):
    """
    Delete feedback entry.
    """
    try:
        feedback = Feedback.objects.get(id=feedback_id)
        feedback.delete()
        return Response({"message": "Feedback deleted successfully"})
    except Feedback.DoesNotExist:
        return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)
