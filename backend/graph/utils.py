from collections import deque

class Logger:
    def __init__(self, structure):
        self.stucture = structure
        self.steps = []
        self.size = 0

    def log(self, queue=[], visited=[], current='', path=[], neighbors=[], found=False):
        self.size += 1
        self.steps.append({
            'step': self.size,
            self.stucture: list(queue),
            'visited': visited.copy(),
            'current': current,
            'path': path,
            'neighbors': neighbors,
            'found': found
        })

def decoder(json_object):
    graf = {}
    for node in json_object:
        graf[node['id']] = node['neighbors']
    return graf

def getpath(parent, current_node, start):
    path = []
    while current_node != start:
        path.append(current_node)
        current_node = parent[current_node]
    path.append(start)
    return path[::-1]

def BFS(json_object, start, end):
    graf = decoder(json_object)
    parent = {}
    logger = Logger('queue')

    visited = [start]
    queue = deque([start])
    logger.log(queue=queue)
    while len(queue) > 0:
        
        current_node = queue.popleft()
        path = getpath(parent, current_node, start)
        logger.log(queue=queue, visited=visited, current=current_node, path=path)
        neighbors = list(graf[current_node])
        logger.log(queue=queue, visited=visited, current=current_node, path=path, neighbors=neighbors)
    
        for node in neighbors:
            if node == end:
                visited.append(node)
                parent[node] = current_node
                path = getpath(parent, node, start)
                logger.log(queue=queue, visited=visited, current=node, path=path, found=True)
                return logger.steps
            if node not in visited:
                queue.append(node)
                visited.append(node)
                logger.log(queue=queue, visited=visited, current=current_node, path=path)
                parent[node] = current_node
    return logger.steps


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

print(BFS(STATIC_GRAPH['nodes'], STATIC_GRAPH['start_node'], STATIC_GRAPH['end_node']))