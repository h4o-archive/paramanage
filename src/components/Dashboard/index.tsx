import React from "react"

import { Button } from "components/Common/Button";
import { PlatformsDropdown, VersionsDropdown, EnvironmentsDashboard } from "components/Dashboard/Metadatas";
import { DashboardAddDropdownButton, DashboardAddModal } from "components/Dashboard/Add"
import { Configs } from "components/Dashboard/Configs";

export const Dashboard: React.FunctionComponent = () => {

  return (
    <div className="ui container" style={{ marginTop: "2em" }}>

      <div className="ui doubling stackable grid">

        <div className="row">
          <div className="nine wide computer only column">
            <Button icon="big blue modx spin" transparent />
          </div>
          <div className="center aligned mobile only column">
            <Button icon="big blue modx spin" transparent />
          </div>
          <div className="two wide column">
            <PlatformsDropdown />
          </div>
          <div className="three wide column">
            <VersionsDropdown />
          </div>
          <div className="two wide right aligned column">
            <DashboardAddDropdownButton />
          </div>
        </div>
        <DashboardAddModal />

        <div className="row">
          <div className="sixteen wide column">
            <EnvironmentsDashboard>
              <Configs />
            </EnvironmentsDashboard>
          </div>
        </div>

        <div className="row">
          <div className="right aligned column">
            <Button btn="grey" label="Add Template" />
            <Button btn="grey" label="Export" />
            <Button btn="negative" label="Deploy" />
          </div>
        </div>

      </div>

    </div>
  )

}