# eligibility/serializers.py
from rest_framework import serializers
from .models import Eligibility

class EligibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Eligibility
        fields = "__all__"
