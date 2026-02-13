import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from donate.models import Donor
from django.db.models import Q

# 1. Reset 'Last Donated' for all users linked to these donors to NULL (so cooldown is False)
# 2. Set 'is_available' to True for all 'APPROVED' donors
# 3. Ensure Status is APPROVED

donors = Donor.objects.all()
count_reset = 0

for d in donors:
    # Reset cooldown
    if d.user.last_donated_at is not None:
        print(f"Resetting last_donated_at for {d.name}")
        d.user.last_donated_at = None
        d.user.save()
        count_reset += 1
        
    # Reset availability if approved
    if d.status == 'APPROVED' and not d.is_available:
        print(f"Setting is_available=True for {d.name}")
        d.is_available = True
        d.save()
        count_reset += 1
        
print(f"Reset complete. {count_reset} updates made.")
