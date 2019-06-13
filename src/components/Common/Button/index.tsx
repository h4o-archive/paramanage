import React, { useContext } from "react"

import { _ } from "utils"
import { ButtonContext } from "./ButtonContext"

import "./icon_spin.css"

type ButtonContentProps = { label?: string, icon?: string }

const ButtonContent: React.FunctionComponent<ButtonContentProps> = ({ label = "Button", icon }) => {
  let { type } = useContext(ButtonContext)

  switch (type) {
    case "icon":
      return <i className={`${type} ${icon}`}></i>
    default:
      return <p>{label}</p>
  }
}

type ButtonProps = Readonly<{
  btn?: string,
  transparent?: boolean,
  style?: React.CSSProperties,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}>

const Button: React.FunctionComponent<ButtonProps> = ({ btn, transparent, style, onClick, children: ButtonContent }) => {
  let { type } = useContext(ButtonContext)
  let className = `ui button ${type} ${btn || ""} ${transparent ? "basic" : ""}`
  let style_overload = { ...style, ...transparent ? { boxShadow: "none", ...style } : {} }

  return (
    <button onClick={onClick} className={className} style={style_overload}>
      {ButtonContent}
    </button >
  )
}

type ButtonWrapperProps = ButtonProps & ButtonContentProps

const ButtonWrapper: React.FunctionComponent<ButtonWrapperProps> = ({ icon, label, btn, transparent, style, onClick }) => {
  let type = icon ? "icon" : ""
  return (
    <ButtonContext.Provider value={{ type }}>
      <Button {...{ btn, transparent, style, onClick }}>
        <ButtonContent {...{ label, icon }} />
      </Button>
    </ButtonContext.Provider>
  )
}

export { ButtonWrapper as Button }