import ReactDOM from 'react-dom/client';
import FloatingChatWidget from './pages/FloatingChatWidget';

const containerId = 'floating-chat-widget-container';
let container = document.getElementById(containerId);

if (!container) {
  container = document.createElement('div');
  document.body.appendChild(container);
}

// Read embed config
const config = (window as any).ChatbotConfig || {};
config.hostDomain = window.location.hostname;

// You may want to customize themeConfig as needed
const themeConfig = (window as any).ChatbotThemeConfig || {};

ReactDOM.createRoot(container!).render(
  <FloatingChatWidget config={config} themeConfig={themeConfig} />
);