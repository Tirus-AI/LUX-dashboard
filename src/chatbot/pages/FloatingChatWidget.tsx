import type { ChatbotThemeConfig } from '../chatbotConfig';
import { useAI } from '../components/AIContext';
import ChatUI from './ChatUI';
import { Box, IconButton, Fade } from '@mui/material';
import { FaRobot } from 'react-icons/fa';

interface FloatingChatWidgetProps {
  config: any;
  themeConfig: ChatbotThemeConfig;
}

const FloatingChatWidget = ({ config, themeConfig }: FloatingChatWidgetProps) => {
  const { isChatOpen, toggleChat } = useAI();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1500,
        }}
      >
        <IconButton
          onClick={toggleChat}
          sx={{
            bgcolor: themeConfig.primary,
            color: '#fff',
            width: 56,
            height: 56,
            boxShadow: 3,
            '&:hover': { bgcolor: themeConfig.secondary },
          }}
        >
          {themeConfig.robotIcon ?? <FaRobot />}
        </IconButton>
      </Box>

      <Fade in={isChatOpen}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            zIndex: 1400,
            maxWidth: '100vw',
          }}
        >
          <ChatUI config={config} themeConfig={themeConfig} />
        </Box>
      </Fade>
    </>
  );
};

export default FloatingChatWidget;