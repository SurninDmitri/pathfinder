from collections import deque

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
    steps = []

    step = 0
    visited = [start]
    queue = deque([start])

    while len(queue) > 0:
        step += 1
        current_node = queue.popleft()
        neighbors = list(graf[current_node])
        path = getpath(parent, current_node, start)

        steps.append(
            {
                'step': step,
                'visited': visited.copy(),
                'current': current_node,
                'path': path,
                'neighbors': neighbors,
                'queue': list(queue),
                'found': False
            }
        )
        
        for node in neighbors:
            if node == end:
                visited.append(node)
                parent[node] = current_node
                path = getpath(parent, node, start)

                step += 1
                steps.append(
                    {
                        'step': step,
                        'visited': visited.copy(),
                        'current': node,
                        'path': path,
                        'neighbors': neighbors,
                        'queue': list(queue),
                        'found': True
                    }
                )
                return steps
            if node not in visited:
                queue.append(node)
                visited.append(node)
                parent[node] = current_node
    return steps
