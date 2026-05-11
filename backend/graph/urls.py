from django.urls import path
from . import views

urlpatterns = [
    path('home/', view=views.HomeGraph.as_view(), name='home-graph'),
    path('graph/', view=views.GraphCreateList.as_view(), name='list'),
    path('graph/<int:pk>/', view=views.GraphDetail.as_view(), name='detail'),
    path('graph/<int:pk>/run/', view=views.graph_run, name='run'),
]
