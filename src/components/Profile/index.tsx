import React from "react"

import { ProfileMenu } from "components/Profile/Menu/ProfileMenu"
import { Parametres } from "./Parametres"

export const Profile: React.FunctionComponent<{ readonly id: string }> = ({ id }) => {
  return (
    <React.Fragment>
      <ProfileMenu />
      <Parametres id={id} />
    </React.Fragment>
  )
}