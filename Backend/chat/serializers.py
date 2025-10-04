from rest_framework import serializers
from .models import Chat,Message,FlaggedChat
from users.serializers import EmployerRegistrationSerializer, CleanerRegistrationSerializer
class ChatSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Chat
        fields = ['id', 'employer', 'cleaner', 'created_at']



class ChatDetailSerializers(serializers.ModelSerializer):
    employer=EmployerRegistrationSerializer()
    cleaner=CleanerRegistrationSerializer()
    class Meta:
        model = Chat
        fields = ['id', 'employer', 'cleaner', 'created_at']    


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender','is_read', 'text', 'file', 'sent_at']


class FlaggedChatSerializer(serializers.ModelSerializer):

    class Meta:
        model=FlaggedChat
        fields = ['id', 'chat', 'flagged_by','reason','resolved','resolution_notes','created_at']
        extra_kwargs = {
            'reason': {'required': True, 'allow_blank': False},
        }
    def validate_reason(self, value):
        """
        Validation for the reason field: Ensures the reason is not empty and has a minimum length.
        """
        if not value.strip():
            raise serializers.ValidationError("Reason cannot be empty.")
        if len(value) < 10:
            raise serializers.ValidationError("Reason must be at least 10 characters long.")
        return value

    def validate(self, attrs):
        """
        General validation to check for specific rules across fields.
        Example: Prevent the same user from flagging the same chat multiple times.
        """
        chat = attrs.get('chat')
        flagged_by = attrs.get('flagged_by')
        if FlaggedChat.objects.filter(chat=chat, flagged_by=flagged_by).exists():
            raise serializers.ValidationError("You have already flagged this chat.")
        return attrs

class FlagChatCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlaggedChat
        fields = ['chat', 'reason']
