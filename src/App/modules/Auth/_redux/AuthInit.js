import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutSplashScreen } from "../../../../layout/_core/SplashScreen";
import axios from "axios";
import { isDevCode } from "../../../../helpers/DevHelpers";
import { setConfig } from "./jsonSlice";

function AuthInit({ isConfig, children }) {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { JsonConfig } = useSelector(({ JsonConfig }) => ({
    JsonConfig: JsonConfig,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    async function requestUser() {
      axios
        .get(
          `${
            isDevCode() ? "https://cser.vn" : ""
          }/brand/global/Global.json?${new Date().valueOf()}`
        )
        .then(function({ data }) {
          // handle success
          dispatch(setConfig(data));
          setShowSplashScreen(false);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    }

    if (isConfig && !JsonConfig) {
      requestUser();
    } else {
      setShowSplashScreen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
}

export default AuthInit;
