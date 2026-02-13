import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from donate.models import Donor

try:
    # Based on debug output, Aida is Donor #17
    d = Donor.objects.get(name__icontains="Aida")
    print(f"Found Donor: {d.name} (ID: {d.id})")
    print(f"Current Status: {d.status}")
    print(f"Current Available: {d.is_available}")
    
    d.is_available = True
    d.save()
    
    print(f"Updated Available: {d.is_available}")
    print("Donor Aida should now appear in the list.")
    
except Donor.DoesNotExist:
    print("Donor Aida not found.")
