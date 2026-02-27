from django.urls import path
from . import views

urlpatterns = [
    path('graph/home/', view=views.home_graph, name='home-graph'),
]
