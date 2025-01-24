'use client';

import Templatesearch from './components/Templatesearch';
import { Provider } from 'react-redux';
import store from './store';

export default function Page() {
  return (
    <Provider store={store}>
      <main className="min-h-screen bg-gray-50">
        <Templatesearch />
      </main>
    </Provider>
  );
}

