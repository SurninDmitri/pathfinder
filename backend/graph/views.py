from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from .utils import BFS
from rest_framework.decorators import api_view
from .serializers import GraphSerializer, RunAlgoritm
from .models import Graph
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def home_graph(request):
    graph = {
        'nodes': [
            {'id': 'a', 'x': 0, 'y': 50, 'neighbors': {'b':1, 'c':1}},
            {'id': 'b', 'x': 10, 'y': 20, 'neighbors': {'c':1, 'f':1}},
            {'id': 'c', 'x': 0, 'y': 50, 'neighbors': {'e':1}},
            {'id': 'f', 'x': 0, 'y': 50, 'neighbors': {'e':1}},
            {'id': 'e', 'x': 0, 'y': 50, 'neighbors': {}},
        ]
    }
    steps = BFS(graph, 'a', 'e')
    
    response = {
        "steps": steps,
    }
    return Response(response, status=status.HTTP_200_OK)

class GraphList(APIView):
    def get(self, request):
        graphs = Graph.objects.all()
        serializer = GraphSerializer(graphs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = GraphSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class GraphDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Graph.objects.all()
    serializer_class = GraphSerializer

@api_view(['GET'])
def graph_run(request, pk:int):
    graph_model = get_object_or_404(Graph, pk=pk)
    serializer = RunAlgoritm(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    start = serializer.validated_data['start']
    end   = serializer.validated_data['end']
    graph = graph_model.nodes
    steps = BFS(graph, start, end)
    return Response(steps, status=status.HTTP_200_OK)