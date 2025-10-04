from django.contrib import admin
from .models import Employer, Cleaner, Role, User, Admin
# Register your models here.
admin.site.register(Role)
admin.site.register(Employer)
admin.site.register(Admin)
admin.site.register(Cleaner)
#admin.site.register(User)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=['id','email','name']
