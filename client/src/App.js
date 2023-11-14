import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { __DEV__ } from '@apollo/client/utilities/globals'

import { BoardPage } from '@/pages'

if (__DEV__) {
  loadDevMessages()
  loadErrorMessages()
}

const App = () => {
  return <BoardPage/>
}

export default App
