import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, createClient, debugExchange, fetchExchange } from 'urql';
import { ThemeProvider } from '../context/ThemeContext';

const mockClient = createClient({
  url: 'https://rickandmortyapi.com/graphql',
  exchanges: [debugExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider value={mockClient}>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render }; 