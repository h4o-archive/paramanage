import React from 'react'
import { connect } from "react-redux"
import { Input, Menu, Dropdown as SemanticDropdown, Responsive, MenuItemProps, DropdownProps } from 'semantic-ui-react'

import { SELECT } from "actions/types"
import { dispatchAction } from "components/actions"
import { _ } from "utils"

import { EnvironmentState } from './metadatas_reducer';
import { State } from 'reducers';

type EnvironmentProp = EnvironmentState & Readonly<{ value: string, text: string }>

type EnvironmentsDashboardProps = Readonly<{
  environments: EnvironmentProp[],
  selected_environment: string,
  dispatchAction: typeof dispatchAction
}>
/**
 * @description React Component - Environment Menu on Home Page
 */
let EnvironmentsDashboard: React.FunctionComponent<EnvironmentsDashboardProps> = ({ environments, selected_environment, ...props }) => {

  function onClickEnvironment(event: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>, { encodedvalue }: MenuItemProps): void {
    props.dispatchAction(SELECT.ENVIRONMENT, encodedvalue)
  }

  function onChangeEnvironment(event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps): void {
    props.dispatchAction(SELECT.ENVIRONMENT, value);
  }

  /**
   * @description Environment Menu on mobile
   */
  let MobileMenu: React.FunctionComponent<{}> = () => {
    return (
      <Menu.Item>
        <SemanticDropdown
          className="icon"
          options={environments}
          onChange={onChangeEnvironment}
          icon="th"
          text=" "
        />
      </Menu.Item>
    )
  }

  /**
 * @description Environment Menu on computer
 */
  let ComputerMenu: React.FunctionComponent<{}> = () => {
    return (
      <React.Fragment>
        {environments.map(item => {
          return (
            <Menu.Item
              as={Menu.Item}
              key={item.id}
              name={item.text}
              encodedvalue={item.value}
              active={selected_environment === item.value}
              onClick={onClickEnvironment}
            />
          )
        })}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>

      <Menu attached='top' tabular>

        <Responsive {...Responsive.onlyMobile} as={MobileMenu} />
        <Responsive {...Responsive.onlyComputer} as={ComputerMenu} />

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

function mapStateToProps(state: State) {
  let { data, selected } = state.metadatas_reducer.environments
  return {
    environments: _.map(data, item => ({ ...item, value: item.id, text: item.key })).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_environment: selected
  }
}

EnvironmentsDashboard = connect(mapStateToProps, { dispatchAction })(EnvironmentsDashboard) as any
export { EnvironmentsDashboard }