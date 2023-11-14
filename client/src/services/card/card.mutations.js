import { gql } from '@apollo/client'

export const CREATE_CARD = gql`
  mutation CreateCard($title: String!, $description: String!, $status: String!) {
    createCard(title: $title, description: $description, status: $status) {
      card {
        id
        title
        description
        status
      }
    }
  }
`

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $title: String, $description: String, $status: String) {
    updateCard(id: $id, title: $title, description: $description, status: $status) {
      card {
        id
        title
        description
        status
      }
    }
  }
`

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      card {
        id
        title
        description
        status
      }
    }
  }
`