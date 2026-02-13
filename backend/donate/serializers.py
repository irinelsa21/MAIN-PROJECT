from rest_framework import serializers
from .models import HelpQuery, UserRegister
from django.contrib.auth.hashers import make_password
from .models import Announcement

class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = UserRegister
        fields = [
            "name",
            
            "email",
            "phone",
            "blood_group",
            "dob",
            "address",
            "district",
            "password",
            "confirm_password",
            "gender"
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):
       

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


from rest_framework import serializers
from .models import UserRegister

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'dob',
            'blood_group',
            'address',
            'district',
            'profile_picture','gender'        ]
        read_only_fields = ['name', 'dob', 'blood_group','gender']


class RegistrationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = [
            "id",
            "name",
            "email",
            "dob",
            "gender",
            "blood_group",
            "district",
            "status",
            "requested_at",
        ]
class ApprovedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "dob",
            "gender",
            "blood_group",
            "district",
            "address",
            "profile_picture",
            "register_time",
        ]
        

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"



class HelpQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpQuery
        fields = "__all__"
class HelpQuerySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = HelpQuery
        fields = "__all__"

from rest_framework import serializers
from .models import Donor

class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = "__all__"

    def validate(self, data):
        if not data.get("confirmed"):
            raise serializers.ValidationError(
                {"confirmed": "You must confirm information is true"}
            )
        return data

from rest_framework import serializers
from .models import BloodRequest

class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = "__all__"

from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"





