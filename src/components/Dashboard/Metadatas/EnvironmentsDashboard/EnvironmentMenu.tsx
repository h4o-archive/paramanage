import React from 'react'
import { connect } from "react-redux"
import { Menu, Dropdown as SemanticDropdown, Responsive, MenuItemProps, DropdownProps } from 'semantic-ui-react'

import { SELECT } from "actions/types"
import { dispatchAction } from "components/actions"
import { _ } from "utils"

import { EnvironmentState } from '../metadatas_reducer';
import { State } from 'reducers';

type EnvironmentProp = EnvironmentState & Readonly<{ value: string, text: string }>

type EnvironmentMenuMapProps = Readonly<{
  environments: EnvironmentProp[],
  selected_environment: string
}>

type EnvironmentMenuMapActions = {
  readonly dispatchAction: typeof dispatchAction
}

const EnvironmentMenu: React.FunctionComponent<EnvironmentMenuMapActions & EnvironmentMenuMapProps> = ({ environments, selected_environment, ...props }) => {

  function onChangeEnvironment(event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps): void {
    props.dispatchAction(SELECT.ENVIRONMENT, value)
  }

  /**
   * @description Environment Menu on mobile
   */
  const MobileMenu: React.FunctionComponent<{}> = () => {
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

  function onClickEnvironment(event: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>, { encodedvalue }: MenuItemProps): void {
    props.dispatchAction(SELECT.ENVIRONMENT, encodedvalue)
  }

  /**
 * @description Environment Menu on computer
 */
  const ComputerMenu: React.FunctionComponent<{}> = () => {
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
      <Responsive {...Responsive.onlyMobile} as={MobileMenu} />
      <Responsive {...Responsive.onlyComputer} as={ComputerMenu} />
    </React.Fragment>
  )
}

function mapStateToProps(state: State): EnvironmentMenuMapProps {
  const { data, selected } = state.metadatas_reducer.environments
  return {
    environments: _.map(data, item => ({ ...item, value: item.id, text: item.key })).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_environment: selected
  }
}

const ConnectedEnvironmentMenu = connect<EnvironmentMenuMapProps, EnvironmentMenuMapActions, {}, State>(mapStateToProps, { dispatchAction })(EnvironmentMenu)
export { ConnectedEnvironmentMenu as EnvironmentMenu }