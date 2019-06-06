import React from "react"

import { _ } from "utils"

import "./icon_spin.css"

type ButtonProps = {
  icon?: string,
  label: string,
  btn?: string,
  transparent?: boolean,
  style?: React.CSSProperties,
  onClick?: _.type.func
}
export const Button: React.FunctionComponent<ButtonProps> = ({ icon, label = "Button", btn, transparent, style, onClick }) => {

  const ButtonContent: React.FunctionComponent = () => {
    switch (type) {
      case "icon":
        return <i className={`${type} ${icon}`}></i>
      default:
        return <p>{label}</p>
    }
  }

  let type = icon ? "icon" : ""
  let className = `ui button ${type} ${btn || ""} ${transparent ? "basic" : ""}`
  let style_overload = { ...style, ...transparent ? { boxShadow: "none", ...style } : {} }
  return (
    <button onClick={onClick} className={className} style={style_overload}>
      <ButtonContent />
    </button >
  )
}