import React from "react"
import { Input, Menu } from 'semantic-ui-react'

import { EnvironmentMenu } from "./EnvironmentMenu"

/**
 * @description Environment Dashboard on Home Page
 */
export const EnvironmentsDashboard: React.FunctionComponent = (props) => {

  return (
    <React.Fragment>

      <Menu attached='top' tabular>

        <EnvironmentMenu />

        <Menu.Menu position='right' style={{ overflow: "auto" }}>
          <Menu.Item position='right'>
            <Input
              position='right'
              transparent
              placeholder='Deployed 01/04/2019'
              icon={{ name: 'search', link: true }}
              style={{ width: "45vw", maxWidth: "200px" }}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <div className="ui bottom attached segment">
        {props.children}
      </div>

    </React.Fragment>
  )
}