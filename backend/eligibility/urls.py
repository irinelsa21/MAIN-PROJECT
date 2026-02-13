from django.urls import path

from eligibility.views import check_eligibility, eligibility_user 

urlpatterns = [
    path("user/<int:user_id>/", eligibility_user),
    path("check/", check_eligibility),
]
