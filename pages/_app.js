
import React from 'react'

import "../components/alert/alert.css"
import "../components/chatWindow/chatWindow.css"
import "../components/trainingWindow/trainingWindow.css"
import "../components/infoPage/infoPage.css"
import "../components/infoPage/infoPage.css"
import "../components/offline/offline.css"
import "../components/popMenu/popMenu.css"
import "../components/title/title.css"
import "../components/title/loader.css"
import "../components/topNav/topNav.css"
import "./index.css"

export default function App({ Component, pageProps }) {
    return (
      <Component {...pageProps} />
    );
  }