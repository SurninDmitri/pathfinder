from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics

from .permissions import IsOnlyAuthor
from .utils import BFS
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .serializers import GraphSerializer, RunAlgoritm
from .models import Graph
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def home_graph(request):
    graph = {
        'nodes': [
            {'id': 'a', 'x': 0, 'y': 50, 'neighbors': {'b':1, 'c':1}},
            {'id': 'b', 'x': 10, 'y': 20, 'neighbors': {'c':1, 'f':1}},
            {'id': 'c', 'x': 0, 'y': 50, 'neighbors': {'e':1}},
            {'id': 'f', 'x': 0, 'y': 50, 'neighbors': {'e':1}},
            {'id': 'e', 'x': 0, 'y': 50, 'neighbors': {}},
        ],
        'start_node':'a',
        'end_node':'e',
        'short_path':False
    }
    steps = BFS(graph['nodes'], graph['start_node'], graph['end_node'])
    
    response = {
        "steps": steps,
    }
    return Response(response, status=status.HTTP_200_OK)

class GraphCreateList(APIView):    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        graphs = Graph.objects.filter(author=request.user)
        serializer = GraphSerializer(graphs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = GraphSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class GraphDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GraphSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOnlyAuthor]

    def get_queryset(self):
        return Graph.objects.filter(author=self.request.user)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def graph_run(request, pk:int):
    graph_model = get_object_or_404(Graph, pk=pk, author=request.user)
    serializer = RunAlgoritm(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    start = serializer.validated_data['start']
    end = serializer.validated_data['end']
    algo_type = serializer.validated_data['algorithm']
    need_shortest = serializer.validated_data['shortest_path']
    graph = graph_model.nodes
    if algo_type == 'BFS':
        steps = BFS(json_object=graph, start=start, end=end)
    else:
        return Response({"error": "Алгоритм не поддерживается"}, status=400)
    return Response(steps, status=status.HTTP_200_OK)