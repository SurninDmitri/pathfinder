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


class HomeGraph(APIView):
    
    permission_classes = [permissions.AllowAny]
    STATIC_GRAPH = {
        'nodes': [
            {'id': 'A', 'x': 50, 'y': 50, 'neighbors': {'B': 1, 'C': 1}},
            {'id': 'B', 'x': 150, 'y': 20, 'neighbors': {'C': 1, 'F': 1}},
            {'id': 'C', 'x': 100, 'y': 150, 'neighbors': {'E': 1}},
            {'id': 'F', 'x': 250, 'y': 50, 'neighbors': {'E': 1}},
            {'id': 'E', 'x': 200, 'y': 250, 'neighbors': {}},
        ],
        'start_node': 'A',
        'end_node': 'E',
    }

    def get(self, request):
        return Response(self.STATIC_GRAPH, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RunAlgoritm(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        start = serializer.validated_data['start'].upper()
        end = serializer.validated_data['end'].upper()
        algo_type = serializer.validated_data['algorithm']
        need_shortest = serializer.validated_data['shortest_path']
        graph = self.STATIC_GRAPH['nodes']
        if algo_type == 'BFS':
            steps = BFS(json_object=graph, start=start, end=end)
        else:
            return Response({"error": "Алгоритм не поддерживается"}, status=400)
        return Response(steps, status=status.HTTP_200_OK)

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