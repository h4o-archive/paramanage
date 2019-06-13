import React from 'react'
import { Dropdown, DropdownItemProps } from 'semantic-ui-react'

import { _ } from "utils"

type DropdownButtonItemsProps = Readonly<{
  button_items?: any[],
  shouldItemDisplay?: (button_item: any) => boolean,
  onClickOnItem?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps) => void
}>

const DropdownButtonItems: React.FunctionComponent<DropdownButtonItemsProps> = ({ button_items = [], shouldItemDisplay = () => true, onClickOnItem }) => {
  return button_items.reduce((filtered_button_items, button_item) => {
    if (shouldItemDisplay(button_item)) {
      filtered_button_items.push(<Dropdown.Item onClick={onClickOnItem} key={button_item.value} {..._.pick(button_item, ["value", "text"])} />)
    }
    return filtered_button_items
  }, [])
}

type DropdownButtonProps = Readonly<{
  text?: string,
  icon?: string,
  button_style?: React.CSSProperties,
  dropdown_style?: React.CSSProperties,
}>

const DropdownButton: React.FunctionComponent<DropdownButtonProps> = ({ text, icon, button_style, dropdown_style, children: DropdownButtonItems }) => {

  /**
   * @description array of <Dropdown.Item/>
   */

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
        {DropdownButtonItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}

type DropdownButtonWrapperProps = DropdownButtonProps & DropdownButtonItemsProps

const DropdownButtonWrapper: React.FunctionComponent<DropdownButtonWrapperProps> = ({ text, icon, button_style, dropdown_style, button_items, shouldItemDisplay, onClickOnItem }) => {
  return (
    <DropdownButton {...{ text, icon, button_style, dropdown_style }}>
      <DropdownButtonItems {...{ button_items, shouldItemDisplay, onClickOnItem }} />
    </DropdownButton>
  )
}

export { DropdownButtonWrapper as DropdownButton }
