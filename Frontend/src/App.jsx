import { RouterProvider } from 'react-router';
import './App.css';
import router from './routes/router';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
};

export default App
