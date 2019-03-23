from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def tile(request):

    return render(request, 'tile.html')
