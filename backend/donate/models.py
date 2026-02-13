from django.utils import timezone
from django.db import models

class UserRegister(models.Model):
    name = models.CharField(max_length=100)
    #age = models.PositiveIntegerField()
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5)
    dob = models.DateField()
    address = models.TextField()
    password = models.CharField(max_length=255)
    register_time = models.DateTimeField(auto_now_add=True)
    gender = models.CharField(
        max_length=10,
        choices=[
            ("Male", "Male"),
            ("Female", "Female"),
            ("Other", "Other")
        ]
        
    )
    district = models.CharField(
    max_length=50,
    default="Not Selected"
)

    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        default="PENDING"   # PENDING | APPROVED | REJECTED
    )
    requested_at = models.DateTimeField(
        default=timezone.now)
    last_donated_at = models.DateField(null=True, blank=True)

    

    def __str__(self):
        return self.email
    

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    campaign_type = models.CharField(
        max_length=50,
        choices=[
            ("Blood Camp", "Blood Camp"),
            ("Emergency", "Emergency"),
            ("Awareness", "Awareness"),
            ("General", "General"),
        ],
        default="General"
    )
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_active(self):
        from django.utils import timezone
        return self.expiry_date >= timezone.now().date()

    def __str__(self):
        return self.title
    


class HelpQuery(models.Model):
    user = models.ForeignKey(UserRegister, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    replied_at = models.DateTimeField(blank=True, null=True)
    reaction = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.email} - {self.question[:30]}"

from django.db import models
from donate.models import UserRegister

class Donor(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "PENDING"),
        ("APPROVED", "APPROVED"),
        ("REJECTED", "REJECTED"),
    )

    user = models.ForeignKey(UserRegister, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=20)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    district = models.CharField(max_length=100)
    blood_group = models.CharField(max_length=10)

    available_districts = models.TextField()
    confirmation_file = models.FileField(upload_to="donor_files/")

    confirmed = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True)


from django.db import models
from .models import UserRegister

class BloodRequest(models.Model):

    STATUS_CHOICES = (
        ("NOT_SEEN", "NOT_SEEN"),
        ("SEEN", "SEEN"),
    )

    user = models.ForeignKey(UserRegister, on_delete=models.CASCADE)

    requester_name = models.CharField(max_length=100)
    requester_phone = models.CharField(max_length=15)

    patient_name = models.CharField(max_length=100)
    patient_dob = models.DateField()
    gender = models.CharField(max_length=20)

    blood_group = models.CharField(max_length=10)
    blood_component = models.CharField(max_length=30)

    address = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    district = models.CharField(max_length=100)
    relative_phone = models.CharField(max_length=15)

    hospital_name = models.CharField(max_length=150)
    hospital_date = models.DateField()
    hospital_ip_number = models.CharField(max_length=50)

    id_proof = models.FileField(upload_to="blood_requests/")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="NOT_SEEN"
    )

    is_fulfilled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)




class Assignment(models.Model):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.donor.name} assigned to {self.blood_request.patient_name}"

class Feedback(models.Model):
    name = models.CharField(max_length=100)
    review = models.TextField()
    rating = models.IntegerField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating} stars"
