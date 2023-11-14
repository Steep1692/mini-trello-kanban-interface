import { gql } from '@apollo/client'

export const GET_CARDS = gql`
  query GetCards($status: String) {
    cards(status: $status) {
      id
      title
      description
      status
      createdAt
    }
  }
`