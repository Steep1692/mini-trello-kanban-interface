import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'

import apolloClient from './services/apollo'

import App from './App'

import './index.css'


const container = document.getElementById('app')
const root = createRoot(container)

root.render(
  <ApolloProvider client={apolloClient}>
    <App/>
  </ApolloProvider>
)