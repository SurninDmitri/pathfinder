from django.shortcuts import render
from django.http import JsonResponse

def home_graph(request):
    graf = {
        'a': ['b', 'c'],
        'b': ['c', 'f'],
        'c': ['b', 'e'],
        'f': ['e'],
        'e': []
    }
    response = {
        "title": "Интерактивный визуализатор",
        "graph": graf,
    }
    return JsonResponse(response, status=200, json_dumps_params={'ensure_ascii': False})