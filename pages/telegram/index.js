import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styled from "styled-components";
import { useRouter } from "next/router";
import ToolsPanel from "../../components/telegram/tools";
import TopBar from "../../components/telegram/topbar";
import View from "../../components/telegram/view";
import Scene from "../../components/scene/tg-version";

import Export from "../../components/telegram/export";

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
  const [rhinoConnected, setRhinoConnected] = useState(false);
  const [tools, setTools] = useState(false);

  const [version, setVersion] = useState(null);

  const [isExportScreen, setExportScreen] = useState(false);

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;

      if (isExportScreen) {
        webapp.setBackgroundColor("#8F8F8F");
      } else {
        webapp.setBackgroundColor("#f2f2f2");
      }
    }
  }, [isExportScreen]);

  const handleStatus = () => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      webapp.setBackgroundColor("#f2f2f2");

      webapp.expand();

      /*console.log("version", webapp.version);*/

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

  useEffect(() => {
    if (rhinoConnected) {
      window.rhino3dm().then((Module) => {
        console.log("sphere", new Module.Sphere([1, 2, 3], 16));

        const file3dm = new Module.File3dm();

        const embed = new Module.File3dm().getEmbeddedFileAsBase64(file3dm);

        console.log("embed", new Module.File3dm().getEmbeddedFileAsBase64);

        console.log("File3dm", file3dm);
        console.log("Decode", Module);
      });
    }
  }, [rhinoConnected]);

  return (
    <CoreLayout>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => setTgConnected(true)}
      ></Script>

      <Script
        src="https://cdn.jsdelivr.net/npm/rhino3dm@0.12.0/rhino3dm.min.js"
        onLoad={() => setRhinoConnected(true)}
      ></Script>

      <Screen>
        <TopBar />

        <Export enabled={isExportScreen} {...{ setExportScreen }} />

        <View />

        <Space3D>
          <Scene {...{ rhinoConnected }} />
        </Space3D>

        <ToolsPanel enabled={tools} {...{ setTools, setExportScreen }} />
      </Screen>

      {devMainbutton && (
        <DevMainbutton
          onClick={(e) => {
            e.stopPropagation();
            return setTools((state) => !state);
          }}
        >
          Открыть инструменты
        </DevMainbutton>
      )}
    </CoreLayout>
  );
};

export default App;
