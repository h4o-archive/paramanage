import React from "react"

import { ProfileMenu } from "components/Profile/Menu/ProfileMenu"
import { DeleteModal } from "components/Profile/Menu/ProfileMenuModal/DeleteModal"
import { EditAddModal } from "components/Profile/Menu/ProfileMenuModal/EditAddModal"
import { Parametres } from "./Parametres"

export const Profile: React.FunctionComponent<{ readonly id: string }> = ({ id }) => {
  return (
    <React.Fragment>
      <ProfileMenu />
      <DeleteModal />
      <EditAddModal />
      <Parametres id={id} />
    </React.Fragment>
  )
}