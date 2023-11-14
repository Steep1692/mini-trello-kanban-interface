import json
import uuid
from http.server import BaseHTTPRequestHandler
from datetime import datetime

import graphene
from database import table


# FILE: cards/models.py
class DatableEntity(graphene.ObjectType):
    createdAt = graphene.Int()

class CardEntity(DatableEntity):
    id = graphene.ID()
    title = graphene.String()
    description = graphene.String()
    status = graphene.String()


# # FILE: cards/queries.py

# Define a Query class with a list of cards
class CardsQuery(graphene.ObjectType):
    cards = graphene.List(CardEntity, status=graphene.String())

    def resolve_cards(self, info, status=None):
        response = table.scan()
        return response.get('Items', [])


# FILE: cards/mutations.py

# Define a mutation to create a new card
class CreateCardMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()

    card = graphene.Field(lambda: CardEntity)

    def mutate(self, info, title, description, status):
        # Generate a unique ID for the card
        item_id = str(uuid.uuid4())

        current_datetime_timestamp = int(datetime.timestamp(datetime.now()))

        # Add the card to DynamoDB
        item_payload = {
            'id': item_id,
            'title': title,
            'description': description,
            'status': status,
            'createdAt': current_datetime_timestamp
        }
        table.put_item(Item=item_payload)

        # Return the created card
        return CreateCardMutation(card=item_payload)


# Define a mutation to update the status of a card
class UpdateCardMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()

    card = graphene.Field(lambda: CardEntity)

    def mutate(self, info, id, title, description, status):
        # Get the card before updating it (for doing fall backs for the unspecified properties)
        response = table.get_item(Key={'id': id})
        existing_card_data = response.get('Item', {})

        # Update the card in DynamoDB
        table.update_item(
            Key={'id': id},
            UpdateExpression='SET #title = :title, #description = :description, #status = :status',
            ExpressionAttributeNames={
                '#title': 'title',
                '#description': 'description',
                '#status': 'status',
            },
            ExpressionAttributeValues={
                ':title': title,
                ':description': description,
                ':status': status,
            },
            ReturnValues='ALL_NEW'
        )

        # Return the updated card
        return UpdateCardMutation(card=CardEntity(
            id=id,
            title=title,
            description=description,
            status=status
        ))


# Define a mutation to delete a card
class DeleteCardMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    card = graphene.Field(lambda: CardEntity)

    def mutate(self, info, id):
        # Get the card before deleting it (for returning the deleted card in the response)
        response = table.get_item(Key={'id': id})
        card_data = response.get('Item', {})

        # Delete the card from DynamoDB
        table.delete_item(Key={'id': id})

        # Return the deleted card
        return DeleteCardMutation(card=CardEntity(
            id=card_data.get('id'),
            title=card_data.get('title'),
            description=card_data.get('description'),
            status=card_data.get('status'),
        ))


# Create a Mutation class with the defined mutations
class CardsMutation(graphene.ObjectType):
    create_card = CreateCardMutation.Field()
    update_card = UpdateCardMutation.Field()
    delete_card = DeleteCardMutation.Field()


# # FILE: cards/__init__.py

# Create a schema using the Query and Mutation classes
schema = graphene.Schema(query=CardsQuery, mutation=CardsMutation)


# Custom BaseHTTPRequestHandler with CORS headers
class CustomRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')  # Allow specified methods
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Allow specified headers
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()


# Inherit from CustomRequestHandler
class GraphQLHandler(CustomRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        raw_post_data = self.rfile.read(content_length)
        post_data = json.loads(raw_post_data.decode('utf-8'))

        response = self.handle_graphql_query(post_data)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def handle_graphql_query(self, post_data):
        query = post_data.get('query', '')
        variables = post_data.get('variables', {})
        result = schema.execute(query, variables=variables)
        return {'data': result.data}


def __DEV_method_test_specific_schema():
    result = schema.execute("""mutation UpdateCard($id: ID!, $title: String, $description: String, $status: String) {
      updateCard(id: $id, title: $title, description: $description, status: $status) {
        card {
          id
          title
          description
          status
          __typename
        }
        __typename
      }
    }""", variables={
        "title": "my great title",
        "description": "3-desc",
        "status": "Done"
    })

    print('RESULT of test_specific_schema ===>', result)

# __DEV_method_test_specific_schema()