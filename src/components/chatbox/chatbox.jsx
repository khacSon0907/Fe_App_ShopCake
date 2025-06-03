import { useEffect } from 'react';

function Chatbox() {
  useEffect(() => {
    const config = document.createElement("script");
    config.innerHTML = `
      window.difyChatbotConfig = {
        token: 'layB3zJfVmEaq1sE',
        systemVariables: {}
      };
    `;
    document.body.appendChild(config);

    const script = document.createElement("script");
    script.src = "https://udify.app/embed.min.js";
    script.id = "layB3zJfVmEaq1sE";
    script.defer = true;
    document.body.appendChild(script);

    const style = document.createElement("style");
    style.innerHTML = `
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <h1>🎂 Trang web bán bánh</h1>
      <p>Chat với AI ở góc dưới bên phải nhé!</p>
    </div>
  );
}

export default Chatbox;
