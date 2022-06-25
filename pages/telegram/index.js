import React, { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import styled from "styled-components";

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  background: lightgrey;
`;

const App = () => {
  const [tgConnected, setTgConnected] = useState(false);
  const [tools, setTools] = useState(false);

  const handleStatus = () => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть инструменты");

        mainbutton.onClick(() => setTools((state) => !state));
      }

      /*const unsafeData = webapp.initDataUnsafe;
      const user = unsafeData.user;*/

      /*const { id, first_name, last_name, username, photo_url } = user
        ? user
        : {};*/
    }
  };

  /* 5392429785:AAHz-W8Z7YioaoqCyVLjLLDTHlW4uMI78Tg */

  useEffect(() => {
    handleStatus();
  }, [tgConnected]);

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        if (tools) {
          mainbutton.setText("Скрыть инструменты");
        } else {
          mainbutton.setText("Открыть инструменты");
        }
      }
    }
  }, [tools]);

  return (
    <Screen>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setTgConnected(true)}
      ></Script>

      <span>hello</span>

      {tools ? <span>Is open</span> : <span>Is closed</span>}
    </Screen>
  );
};

export default App;
