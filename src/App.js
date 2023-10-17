import { CookiesProvider } from 'react-cookie';
import { ChakraProvider } from '@chakra-ui/react';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';

// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import LoginPage from './pages/LoginPage';
import Router2 from './routes2';







// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <CookiesProvider>
      <BrowserRouter>
      <ChakraProvider>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
            <Router2 />
        </ThemeProvider>
        </ChakraProvider>
      </BrowserRouter>
      </CookiesProvider>
    </HelmetProvider>
  );
}
