from rest_framework import serializers
from .models import Graph

class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = ('nodes','author')
        read_only_fields = ('author',)

class RunAlgoritm(serializers.Serializer):
    start = serializers.CharField(required=True, allow_blank=False)
    end   = serializers.CharField(required=True, allow_blank=False)

    def validate(self, data):
        start = data.get('start')
        end   = data.get('end')
        if start == end:
            raise serializers.ValidationError("start и end не могут быть одинаковыми")
        return data