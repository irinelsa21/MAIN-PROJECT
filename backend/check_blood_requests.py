import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from donate.models import BloodRequest

latest = BloodRequest.objects.order_by('-id').first()
if latest:
    print(f"ID: {latest.id}")
    print(f"Patient: {latest.patient_name}")
    print(f"Hospital Date: {latest.hospital_date}")
    print(f"Created At: {latest.created_at}")
else:
    print("No blood requests found.")
