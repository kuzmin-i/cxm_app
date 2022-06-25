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
  const [tools, setTools] = useState(false);

  const handleStatus = () => {
    if (window.Telegram) {
      console.log("window.Telegram.WebApp", window.Telegram.WebApp);

      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть инструменты");

        mainbutton.onClick(() => setTools(true));
        mainbutton.offClick(() => setTools(false));
      }

      const unsafeData = webapp.initDataUnsafe;
      const user = unsafeData.user;

      const { id, first_name, last_name, username, photo_url } = user
        ? user
        : {};
    }
  };

  /* 5392429785:AAHz-W8Z7YioaoqCyVLjLLDTHlW4uMI78Tg */

  useEffect(() => {
    handleStatus();
  }, []);

  return (
    <Screen>
      <Head>
        <Script src="https://telegram.org/js/telegram-web-app.js"></Script>
      </Head>

      <span>hello</span>

      {tools ? <span>Is open</span> : <span>Is closed</span>}
    </Screen>
  );
};

export default App;
