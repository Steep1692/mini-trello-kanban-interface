from http.server import HTTPServer
from api import GraphQLHandler

# Start the HTTP server
if __name__ == '__main__':
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, GraphQLHandler)
    print('Starting server on port 8080...')
    httpd.serve_forever()
