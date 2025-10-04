from django.db import models
from users.models import Employer, Cleaner
from django.utils.timezone import now
from django.contrib.auth import get_user_model
class Chat(models.Model):
    """ Conversation between one cleaner and one employer """
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='chats')
    cleaner = models.ForeignKey(Cleaner, on_delete=models.CASCADE, related_name='chats')
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('employer', 'cleaner')  


class Message(models.Model):
    """ Message for a chat """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=1, choices=[('e', 'Employer'), ('c', 'Cleaner')])
    text = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='messages/', blank=True, null=True)
    sent_at = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)
    is_flagged = models.BooleanField(default=False) 

    def __str__(self):
        return f"Message from {self.sender} in chat {self.chat.id}"

    def is_audio_or_video(self):
        if self.file:
            extension = self.file.name.split('.')[-1].lower()
            return extension in ['mp3', 'wav', 'mp4', 'mov', 'avi']
        return False

    class Meta:
        ordering=["-sent_at"]


class FlaggedChat(models.Model):
    """ The FlaggedChat model represents chat messages that have been reported for inappropriate or concerning content"""
    chat = models.OneToOneField(Chat, on_delete=models.CASCADE)
    flagged_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    reason = models.TextField()
    resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)