import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from donate.models import Donor, BloodRequest

print("--- DEBUGGING BLOOD DONATION MATCHING ---")

requests = BloodRequest.objects.all()
donors = Donor.objects.all()

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

output_path = "e:/blooddonation/backend/debug_output.txt"
with open(output_path, "w") as f:
    f.write(f"Found {requests.count()} Blood Requests:\n")
    for r in requests:
        f.write(f"  [Request #{r.id}] Patient: {r.patient_name}, Group: {r.blood_group}, Status: {r.status}, Fulfilled: {r.is_fulfilled}\n")
        
        patient_bg = r.blood_group.upper()
        compatible_types = [
            donor_bg for donor_bg, can_give in BLOOD_COMPATIBILITY.items()
            if patient_bg in can_give
        ]
        
        f.write(f"    -> Needs Donor Types: {compatible_types}\n")
        
        matching_donors = donors.filter(blood_group__in=compatible_types)
        
        for d in matching_donors:
            f.write(f"    -> Checking Donor #{d.id} ({d.name}, {d.blood_group}):\n")
            f.write(f"       - Status: '{d.status}' (Needs 'APPROVED')\n")
            f.write(f"       - Available: {d.is_available} (Needs True)\n")
            
            last_donated = d.user.last_donated_at
            is_cooldown = False
            if last_donated:
                days_since = (timezone.now().date() - last_donated).days
                if days_since < 90:
                    is_cooldown = True
                f.write(f"       - Last Donated: {last_donated} ({days_since} days ago)\n")
            else:
                f.write(f"       - Last Donated: Never\n")
                
            is_approved_or_pending = d.status in ['APPROVED', 'PENDING']
            should_match = is_approved_or_pending and d.is_available and not is_cooldown
            
            f.write(f"       -> Checks: Approved/Pending={is_approved_or_pending}, Available={d.is_available}, Cooldown={is_cooldown}\n")
            
            if should_match:
                f.write("       => MATCH! Should appear.\n")
            else:
                f.write("       => NO MATCH.\n") 
