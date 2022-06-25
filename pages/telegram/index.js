import React, { useEffect } from "react";
import styled from "styled-components";

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  background: lightgrey;
`;

const App = () => {
  const handleStatus = () => {
    if (window.Telegram) {
      console.log("window.Telegram.WebApp", window.Telegram.WebApp);

      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть инструменты");
      }

      const unsafeData = webapp.initDataUnsafe;
      const user = unsafeData.user;

      const { id, first_name, last_name, username, photo_url } = user
        ? user
        : {};

      if (first_name) setName(first_name);
      if (fename) setFename(last_name);
      if (photo_url) setPhoto(photo_url);
    }
  };

  useEffect(() => {
    handleStatus();
  }, []);

  return (
    <Screen>
      <span>hello</span>
    </Screen>
  );
};

export default App;
