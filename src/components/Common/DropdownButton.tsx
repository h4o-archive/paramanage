import React from 'react'
import { Dropdown } from 'semantic-ui-react'

import { _ } from "utils"

interface DropdownButtonProps {
  text?: string,
  icon?: string,
  button_style?: React.CSSProperties,
  dropdown_style?: React.CSSProperties,
  button_items: any[],
  shouldItemDisplay: _.type.func,
  onClickOnItem?: _.type.func
}
export const DropdownButton: React.FunctionComponent<DropdownButtonProps> = ({ text, icon, button_style, dropdown_style, button_items = [], shouldItemDisplay = () => true, onClickOnItem }) => {

  /**
   * @description array of <Dropdown.Item/>
   */
  const DropdownButtonItems: React.FunctionComponent = () => {
    return button_items.reduce((filtered_button_items, button_item) => {
      if (shouldItemDisplay(button_item)) {
        filtered_button_items.push(<Dropdown.Item onClick={onClickOnItem} key={button_item.value} {..._.pick(button_item, ["value", "text"])} />)
      }
      return filtered_button_items
    }, [])
  }

  return (
    <Dropdown
      {...{ text, icon }}
      labeled={text ? true : false}
      floating
      button
      className='icon'
      style={button_style}
    >
      <Dropdown.Menu style={dropdown_style}>
        <DropdownButtonItems />
      </Dropdown.Menu>
    </Dropdown>
  )
}