import React, { useContext } from "react"

import { ButtonContext } from "./ButtonContext"

import "./icon_spin.css"

type ButtonContentProps = { label?: string, icon?: string }

const ButtonContent: React.FunctionComponent<ButtonContentProps> = ({ label = "Button", icon }) => {
  const { type } = useContext(ButtonContext)

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
  const { type } = useContext(ButtonContext)
  const className = `ui button ${type} ${btn || ""} ${transparent ? "basic" : ""}`
  const style_overload = { ...style, ...transparent ? { boxShadow: "none", ...style } : {} }

  return (
    <button onClick={onClick} className={className} style={style_overload}>
      {ButtonContent}
    </button >
  )
}

type ButtonWrapperProps = ButtonProps & ButtonContentProps

const ButtonWrapper: React.FunctionComponent<ButtonWrapperProps> = ({ icon, label, btn, transparent, style, onClick }) => {
  const type = icon ? "icon" : ""
  return (
    <ButtonContext.Provider value={{ type }}>
      <Button {...{ btn, transparent, style, onClick }}>
        <ButtonContent {...{ label, icon }} />
      </Button>
    </ButtonContext.Provider>
  )
}

export { ButtonWrapper as Button }