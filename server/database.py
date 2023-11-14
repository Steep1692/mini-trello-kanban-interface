import boto3

# Initialize a DynamoDB client
# Create a session with dummy credentials
session = boto3.session.Session()
dummy_credentials = {
    'access_key': 'anything',
    'secret_key': 'anything',
    'token': 'anything',
}

# Specify the endpoint URL for DynamoDB Local and use the dummy credentials
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url='http://localhost:8000',
    region_name='dummy-region',
    aws_access_key_id=dummy_credentials['access_key'],
    aws_secret_access_key=dummy_credentials['secret_key'],
    aws_session_token=dummy_credentials['token']
)

table_name = 'KanbanCards'

def initTable(table_name):
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {'AttributeName': 'id', 'KeyType': 'HASH'},  # Replace 'id' with your primary key attribute
        ],
        AttributeDefinitions=[
            {'AttributeName': 'id', 'AttributeType': 'S'},  # Replace 'id' and 'S' based on your attribute type
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5,
        }
    )

    # Wait for the table to be created
    table.meta.client.get_waiter('table_exists').wait(TableName=table_name)


try:
    table = dynamodb.Table(table_name)
    table.load()
except dynamodb.meta.client.exceptions.ResourceNotFoundException:
    initTable(table_name)
    table = dynamodb.Table(table_name)

