from django.db import models
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Graph(models.Model):
    nodes = models.JSONField(
        default=dict,
        verbose_name="Данные графа"
    )

    author = models.ForeignKey(
        User,
        related_name="graphs",
        verbose_name="Автор",
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Граф"
        verbose_name_plural = "Графы"
        ordering = ["-updated_at"]