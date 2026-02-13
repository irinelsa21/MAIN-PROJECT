# eligibility/models.py
from django.db import models
from donate.models import UserRegister

class Eligibility(models.Model):
    user = models.ForeignKey(UserRegister, on_delete=models.CASCADE)

    age = models.IntegerField()
    weight = models.FloatField()
    hemoglobin = models.FloatField()
    last_donation_date = models.DateField()

    medications = models.BooleanField()
    tattoo = models.BooleanField()
    illness = models.BooleanField()

    eligible = models.BooleanField()
    reasons = models.TextField()

    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {'Eligible' if self.eligible else 'Not Eligible'}"
