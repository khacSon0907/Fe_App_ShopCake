import React, { useEffect } from "react";

const Chatbox = () => {
  useEffect(() => {
    // Inject the Dify script
    const script = document.createElement("script");
    script.src = "https://udify.app/embed.min.js";
    script.id = "Y7rYm87U2r238vb2";
    script.defer = true;

    // Inject the config script
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.difyChatbotConfig = {
        token: 'Y7rYm87U2r238vb2',
        systemVariables: {
          // user_id: 'YOU CAN DEFINE USER ID HERE',
          // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
        },
        userVariables: {
          // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
          // name: 'YOU CAN DEFINE USER NAME HERE',
        },
      }
    `;

    // Enhanced black theme styles
    const style = document.createElement("style");
    style.innerHTML = `
      /* Chatbot Button Styling */
      #dify-chatbot-bubble-button {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        border: 2px solid #333 !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        backdrop-filter: blur(10px) !important;
      }
      
      #dify-chatbot-bubble-button:hover {
        background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%) !important;
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.15) !important;
        border-color: #555 !important;
      }
      
      #dify-chatbot-bubble-button svg {
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) !important;
      }

      /* Chat Window Styling */
      #dify-chatbot-bubble-window {
        width: 26rem !important;
        height: 42rem !important;
        background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%) !important;
        border: 1px solid #333 !important;
        border-radius: 20px !important;
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.5),
          0 0 40px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(20px) !important;
        overflow: hidden !important;
      }

      /* Header Styling */
      #dify-chatbot-bubble-window .dify-chat-header,
      #dify-chatbot-bubble-window [class*="header"] {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        border-bottom: 1px solid #333 !important;
        color: #ffffff !important;
        padding: 1rem !important;
        backdrop-filter: blur(10px) !important;
      }

      /* Chat Content Area */
      #dify-chatbot-bubble-window .dify-chat-content,
      #dify-chatbot-bubble-window [class*="content"] {
        background: transparent !important;
        color: #e5e5e5 !important;
      }

      /* Message Bubbles */
      #dify-chatbot-bubble-window .dify-message-user,
      #dify-chatbot-bubble-window [class*="user-message"] {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        color: #ffffff !important;
        border-radius: 18px 18px 4px 18px !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      #dify-chatbot-bubble-window .dify-message-assistant,
      #dify-chatbot-bubble-window [class*="assistant-message"],
      #dify-chatbot-bubble-window [class*="bot-message"] {
        background: linear-gradient(135deg, #262626 0%, #404040 100%) !important;
        color: #f5f5f5 !important;
        border-radius: 18px 18px 18px 4px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        border: 1px solid #555 !important;
      }

      /* Input Area */
      #dify-chatbot-bubble-window .dify-input-area,
      #dify-chatbot-bubble-window [class*="input"] {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        border-top: 1px solid #333 !important;
        padding: 1rem !important;
      }

      #dify-chatbot-bubble-window input,
      #dify-chatbot-bubble-window textarea {
        background: rgba(0, 0, 0, 0.5) !important;
        border: 1px solid #555 !important;
        border-radius: 12px !important;
        color: #ffffff !important;
        padding: 0.75rem 1rem !important;
        transition: all 0.3s ease !important;
      }

      #dify-chatbot-bubble-window input:focus,
      #dify-chatbot-bubble-window textarea:focus {
        border-color: #2563eb !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        outline: none !important;
      }

      #dify-chatbot-bubble-window input::placeholder,
      #dify-chatbot-bubble-window textarea::placeholder {
        color: #888 !important;
      }

      /* Send Button */
      #dify-chatbot-bubble-window button[type="submit"],
      #dify-chatbot-bubble-window .dify-send-button {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        border: none !important;
        border-radius: 10px !important;
        color: #ffffff !important;
        padding: 0.75rem 1.5rem !important;
        transition: all 0.3s ease !important;
        font-weight: 600 !important;
      }

      #dify-chatbot-bubble-window button[type="submit"]:hover,
      #dify-chatbot-bubble-window .dify-send-button:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4) !important;
      }

      /* Scrollbar Styling */
      #dify-chatbot-bubble-window ::-webkit-scrollbar {
        width: 8px !important;
      }

      #dify-chatbot-bubble-window ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3) !important;
        border-radius: 4px !important;
      }

      #dify-chatbot-bubble-window ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #404040 0%, #555 100%) !important;
        border-radius: 4px !important;
        border: 1px solid #333 !important;
      }

      #dify-chatbot-bubble-window ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #555 0%, #666 100%) !important;
      }

      /* Loading Animation */
      #dify-chatbot-bubble-window .dify-loading {
        color: #888 !important;
      }

      /* Close Button */
      #dify-chatbot-bubble-window .dify-close-button,
      #dify-chatbot-bubble-window [class*="close"] {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid #555 !important;
        border-radius: 50% !important;
        color: #ffffff !important;
        transition: all 0.3s ease !important;
      }

      #dify-chatbot-bubble-window .dify-close-button:hover,
      #dify-chatbot-bubble-window [class*="close"]:hover {
        background: rgba(239, 68, 68, 0.8) !important;
        border-color: #ef4444 !important;
      }

      /* Typing Indicator */
      #dify-chatbot-bubble-window .dify-typing {
        background: rgba(64, 64, 64, 0.8) !important;
        border-radius: 18px !important;
        color: #ccc !important;
      }

      /* Additional Responsive Adjustments */
      @media (max-width: 768px) {
        #dify-chatbot-bubble-window {
          width: 22rem !important;
          height: 38rem !important;
        }
      }
    `;

    document.head.appendChild(configScript);
    document.head.appendChild(script);
    document.head.appendChild(style);

    return () => {
      // Clean up to avoid duplicate scripts/styles if component unmounts
      if (document.head.contains(configScript)) {
        document.head.removeChild(configScript);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null; // This component only injects scripts/styles
};

export default Chatbox;