import { AIProvider } from './components/AIContext';
import FloatingChatWidget from './pages/FloatingChatWidget';
// import { ThemeProvider } from 'react-admin';
import { ThemeProvider } from '@mui/material/styles';

import { defaultChatbotTheme } from './chatbotConfig';
import type { ChatbotThemeConfig } from './chatbotConfig';
import { muiTheme } from './chatbotConfig'; // make sure you export this

interface AppProps {
  config?: any;
  themeConfig?: ChatbotThemeConfig;
}

function Chatbot ({ config, themeConfig = defaultChatbotTheme }: AppProps) {
  return (
    <AIProvider>
      <ThemeProvider theme={muiTheme}>
        <FloatingChatWidget config={config} themeConfig={themeConfig} />
      </ThemeProvider>
    </AIProvider>
  );
}

export default Chatbot;