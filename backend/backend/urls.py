from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/', include('graph.urls')),
]

# users/ — создание пользователя (регистрация)
# users/me/ — текущий пользователь
# users/{id}/ — пользователь по id
# users/confirm/ — подтверждение email
# users/resend_activation/ — повторная отправка активации
# users/set_password/ — смена пароля
# users/reset_password/ — запрос на сброс пароля
# users/reset_password_confirm/ — подтверждение сброса
# users/set_username/ — смена username
# users/reset_username/ — сброс username
# users/reset_username_confirm/ — подтверждение
# jwt/create/ — получить access + refresh токены
# jwt/refresh/ — обновить access токен
# jwt/verify/ — проверить токен