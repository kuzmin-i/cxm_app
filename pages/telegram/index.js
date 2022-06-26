import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styled from "styled-components";
import { useRouter } from "next/router";
import ToolsPanel from "../../components/telegram/tools";
import TopBar from "../../components/telegram/topbar";
import View from "../../components/telegram/view";
import Scene from "../../components/scene/tg-version";

const CoreLayout = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

const Screen = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background: white;

  position: relative;
`;

const DevMainbutton = styled.div`
  width: 100%;
  height: 62px;
  background: #40a7e3;
  font-size: 15px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Space3D = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: #f2f2f2;
`;

const App = () => {
  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { dev } = query;

  const devMainbutton = useMemo(() => {
    if (dev) return true;
  }, [dev]);

  const [tgConnected, setTgConnected] = useState(false);
  const [tools, setTools] = useState(false);

  const [version, setVersion] = useState(null);

  const handleStatus = () => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      /*webapp.setBackgroundColor("#f2f2f2");
      webapp.setHeaderColor("#f2f2f2");

      console.log("version", webapp.version);*/

      setVersion(webapp.version);

      /*webapp.headerColor = "#f2f2f2";
      webapp.backgroundColor = "#f2f2f2";*/

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
    <CoreLayout>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setTgConnected(true)}
      ></Script>

      <h1>{version}</h1>

      <Screen>
        <TopBar />

        <View />

        <Space3D>{/* <Scene /> */}</Space3D>

        <ToolsPanel enabled={tools} />
      </Screen>

      {devMainbutton && (
        <DevMainbutton onClick={() => setTools((state) => !state)}>
          Открыть инструменты
        </DevMainbutton>
      )}
    </CoreLayout>
  );
};

export default App;
