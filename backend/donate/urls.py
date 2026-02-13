from django.urls import path, include
from django.contrib import admin
from .views import DeleteUserView, UserProfileView, active_announcements, admin_blood_requests, admin_donor_list,  admin_help_queries, admin_reply_query,   all_announcements, assign_donors, blood_request_user, check_email_availability, create_announcement, create_help_query, delete_announcement, delete_help_query,  delete_user,approved_users, get_compatible_donors, mark_blood_request_seen, my_blood_requests, my_donations, my_help_queries, react_to_reply,  register_user, submit_blood_request, submit_donor, donor_user,update_announcement, update_user_status, user_announcements,admin_update_donor_status, get_assigned_donors, submit_assignment, admin_all_assignments, user_assignment_history, admin_statistics, user_dashboard_stats, public_home_data, submit_feedback, admin_get_feedbacks, admin_update_feedback_status, admin_delete_feedback

from .views import login_view
from .views import get_user_profile
from .views import registration_requests
from .views import download_users_report, download_assignments_report



urlpatterns = [
    path("register/", register_user),
    path("check-email/", check_email_availability),
    path("login/", login_view),
    path("profile/", get_user_profile),
    #path("admin/", admin.site.urls),
    path('user-profile/<int:user_id>/', UserProfileView.as_view()),
    path('delete-user/<int:user_id>/', DeleteUserView.as_view()),  
     path("registration-requests/", registration_requests),
    path("update-user-status/<int:user_id>/", update_user_status),
    path("approved-users/", approved_users),
    path("delete-user/<int:user_id>/", delete_user),
    path("announcements/", active_announcements),
path("announcements/all/", all_announcements),
path("announcements/create/", create_announcement),
path("announcements/update/<int:id>/", update_announcement),
path("announcements/delete/<int:id>/", delete_announcement),
path("user/announcements/", user_announcements),
 path("help/create/", create_help_query),
path("help/my/", my_help_queries),
path("help/delete/<int:query_id>/", delete_help_query),
    path("admin/help/", admin_help_queries),
    path("admin/help/reply/<int:query_id>/", admin_reply_query),
    path("help/react/", react_to_reply),
    path("donor/user/<int:user_id>/", donor_user),
path("donor/submit/", submit_donor),
path("donor/my/<int:user_id>/", my_donations),
path("admin/donors/", admin_donor_list),
path("admin/donor-status/<int:donor_id>/", admin_update_donor_status),
    path("blood-request/user/<int:user_id>/", blood_request_user),
    path("blood-request/submit/", submit_blood_request),
    path("blood-request/my/<int:user_id>/", my_blood_requests),
    path("admin/blood-requests/", admin_blood_requests),
path("admin/blood-requests/seen/<int:request_id>/", mark_blood_request_seen),
path("admin/get-compatible-donors/<int:request_id>/", get_compatible_donors),
path("admin/assign-donors/<int:request_id>/", assign_donors),
    path("admin/get-assigned-donors/<int:request_id>/", get_assigned_donors),
    path("admin/submit-assignment/<int:request_id>/", submit_assignment),
    path("admin/assignments/", admin_all_assignments),
    path("user/assignments/<int:user_id>/", user_assignment_history),
    path("admin/statistics/", admin_statistics),
    path("admin/download-users/", download_users_report),
    path("admin/download-assignments/", download_assignments_report),
    path("user/dashboard-stats/<int:user_id>/", user_dashboard_stats),
    path("public-home-data/", public_home_data),
    path("submit-feedback/", submit_feedback),
    path("admin/feedbacks/", admin_get_feedbacks),
    path("admin/feedback-status/<int:feedback_id>/", admin_update_feedback_status),
    path("admin/feedback-delete/<int:feedback_id>/", admin_delete_feedback),
]
