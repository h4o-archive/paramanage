import React from "react"

import { TopMenu } from "components/Profile/Menu/TopMenu"
import { Parametres } from "./Parametres"

export const Profile: React.FunctionComponent<{ readonly id: string }> = ({ id }) => {
  return (
    <React.Fragment>
      <TopMenu />
      <Parametres id={id} />
    </React.Fragment>
  )
}