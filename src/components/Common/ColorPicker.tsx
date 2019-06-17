import React, { useState } from 'react'
import { CompactPicker } from 'react-color'
import { Responsive } from "semantic-ui-react"

import { COLOR } from "utils/const"

type Color = {
  hex: string,
  [keys: string]: any
}

type ColorPickerOwnProps = {
  default_color?: string,
  onChange?: (color: Color) => void,
  style?: React.CSSProperties
}

export const ColorPicker: React.FunctionComponent<ColorPickerOwnProps> = ({ onChange, style, default_color }) => {

  const [state_color, setStateColor] = useState(default_color || (COLOR.GREY as string))
  const [state_display, setStateDisplay] = useState(false)

  function handleClick() {
    setStateDisplay(!state_display)
  };

  function handleClose() {
    setStateDisplay(false)
  };

  // TODO review type of data color passing
  function handleChange({ hex }: Color) {
    setStateColor(hex)
  };

  const handleChange_overload = onChange ? (color: Color) => { onChange(color); handleChange(color) } : handleChange


  const STYLES = {
    COLOR: {
      width: '14px',
      height: '14px',
      borderRadius: '2px',
      background: state_color,
      cursor: 'pointer',
    },
    SWATCH: {
      padding: '2px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      fontSize: "0",
      verticalAlign: "top"
    },
    POPOVER: {
      position: 'absolute',
      zIndex: '2',
      display: state_display ? undefined : "none"
    },
    COVER: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  return (
    <div style={style}>

      <div style={STYLES.SWATCH} >
        <div style={STYLES.COLOR} onClick={handleClick}>
          <Responsive {...Responsive.onlyMobile}
            as={() =>
              <input type="color"
                style={{ ...STYLES.COLOR, zIndex: 2, opacity: 0 }}
                onClick={(e => e.stopPropagation())}
                onChange={e => handleChange_overload({ hex: e.target.value })}
              />}
          />
        </div>
      </div>

      <div style={STYLES.POPOVER as React.CSSProperties}>
        <div style={STYLES.COVER as React.CSSProperties} onClick={handleClose} />
        <CompactPicker color={state_color} onChange={handleChange_overload} />
      </div>

    </div>
  )
}