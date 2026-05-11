from rest_framework import permissions

class IsOnlyAuthor(permissions.BasePermission):
    """
    Разрешает доступ к объекту только его автору.
    """
    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_authenticated and obj.author == request.user