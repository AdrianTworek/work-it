import './i18n'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { store } from './store'
import SocketContextProvider from './contexts/SocketContext'

import App from './App'
import { AuthMiddleware } from './features'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <SocketContextProvider>
      <Router>
        <CookiesProvider>
          <AuthMiddleware>
            <App />
          </AuthMiddleware>
        </CookiesProvider>
      </Router>
    </SocketContextProvider>
  </Provider>
)
