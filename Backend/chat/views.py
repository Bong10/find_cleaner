from django.shortcuts import render
from .models import Chat, Message,FlaggedChat
from rest_framework import viewsets
from.serializers import ChatSerializer, MessageSerializer,FlaggedChatSerializer,FlagChatCreateSerializer,ChatDetailSerializers
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    #permission_classes = (IsAuthenticated, DjangoModelPermissions)
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ChatSerializer
        return ChatDetailSerializers

    @action(detail=False, methods=['get'], url_path='employer/(?P<employer_id>[^/.]+)')
    def employer_chats(self, request, employer_id=None):
        """
        Récupère toutes les conversations d'un employer spécifique
        """
        chats = self.queryset.filter(employer_id=employer_id)
        serializer = self.get_serializer(chats, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='cleaner/(?P<cleaner_id>[^/.]+)')
    def cleaner_chats(self, request, cleaner_id=None):
        """
        Récupère toutes les conversations d'un cleaner spécifique
        """
        chats = self.queryset.filter(cleaner_id=cleaner_id)
        serializer = self.get_serializer(chats, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    #permission_classes = (IsAuthenticated, DjangoModelPermissions)

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """ Renvoie le nombre de message non lus"""
        unread_messages = self.queryset.filter(is_read=False).count()
        return Response({"unread_count": unread_messages})

    @action(detail=True, methods=['get'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        """ Mark message as read and return success"""
        try:
            message = self.get_object()  
            message.is_read = True
            message.save()  
            return Response({"success": "True"}, status=status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response({"success": "False"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='chat/(?P<chat_id>\d+)/messages')
    def get_Chat_messages(self, request, chat_id=None):
        """
        get all message of Chat order by date
        """
        try:
            messages = self.queryset.filter(chat__id=chat_id).order_by("sent_at")
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class FlaggedChatViewSet(viewsets.ModelViewSet):
    queryset = FlaggedChat.objects.all()
    serializer_class = FlaggedChatSerializer

    def create(self, request, *args, **kwargs):
        """Signaler un chat"""
        serializer = FlagChatCreateSerializer(data=request.data)
        if serializer.is_valid():
            chat = serializer.validated_data['chat']
            chat.is_flagged = True
            chat.save()
            flagged_chat = serializer.save(flagged_by=request.user)
            return Response(FlaggedChatSerializer(flagged_chat).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Résoudre un litige"""
        flagged_chat = self.get_object()
        data = request.data

        flagged_chat.resolution_notes = data.get("resolution_notes", flagged_chat.resolution_notes)
        flagged_chat.resolved = data.get("resolved", flagged_chat.resolved)
        flagged_chat.save()

        return Response(FlaggedChatSerializer(flagged_chat).data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        """Lister les chats signalés (avec filtre optionnel pour les non résolus)"""
        resolved = request.query_params.get('resolved', None)
        if resolved is not None:
            self.queryset = self.queryset.filter(resolved=resolved.lower() == 'true')
        return super().list(request, *args, **kwargs)
