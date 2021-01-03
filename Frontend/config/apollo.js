import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch,
})

const authLink = setContext((_, { headers }) => {
  //read storage
  const tkn = localStorage.getItem('tkn')

  return {
    headers: {
      ...headers,
      authorization: tkn ? `Bearer ${tkn}` : '',
    },
  }
})

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

export default client
