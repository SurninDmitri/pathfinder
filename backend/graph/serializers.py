from rest_framework import serializers
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Graph
from rest_framework.validators import UniqueTogetherValidator




class NodeSerializer(serializers.Serializer):
    id = serializers.CharField(required=True, min_length=1, allow_blank=False)
    x = serializers.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(300)],
        required=True
    )
    y = serializers.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(300)],
        required=True
    )
    neighbors = serializers.DictField(
        child=serializers.FloatField(validators=[MinValueValidator(1.0)]),
        required=True
    )

class GraphSerializer(serializers.ModelSerializer):
    nodes = serializers.ListField(child=NodeSerializer(), required=True)

    class Meta:
        model = Graph
        fields = ('nodes',)
        
    def validate(self, graf):
        nodes = graf['nodes']
        all_node_id = set(node['id'] for node in nodes)
        if len(nodes) != len(all_node_id):
            raise serializers.ValidationError('Вершины в графе не уникальны!')
        for node in nodes:
            node_id = node['id']
            for neighbor_id in node['neighbors']:
                if neighbor_id not in all_node_id:
                    raise serializers.ValidationError(
                        f"В neighbors вершины '{node_id}' указана несуществующая вершина '{neighbor_id}'."
                    )
                elif neighbor_id == node_id:
                    raise serializers.ValidationError(
                        f"Вершина '{node_id}' не может ссылаться на саму себя."
                    )
        return graf

class RunAlgoritm(serializers.Serializer):
    start = serializers.CharField(required=True, allow_blank=False)
    end   = serializers.CharField(required=True, allow_blank=False)

    def validate(self, data):
        start = data.get('start')
        end   = data.get('end')
        if start == end:
            raise serializers.ValidationError("start и end не могут быть одинаковыми")
        return data