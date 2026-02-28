from django.urls import path
from . import views

urlpatterns = [
    path('home/', view=views.home_graph, name='home-graph'),
    path('graph/', view=views.GraphList.as_view(), name='list'),
    path('graph/<int:pk>/', view=views.GraphDetail.as_view(), name='detail'),
    path('graph/<int:pk>/run/', view=views.graph_run, name='run'),
]
