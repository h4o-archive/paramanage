import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Field, WrappedFieldArrayProps } from "redux-form"

import { Button } from "components/Common/Button"
import { ColorPicker, Color } from "components/Common/ColorPicker"
import { _ } from "utils"
import { COLOR } from "utils/const"
import { SearchResults } from "components/Common/SearchResults"
import { FieldInput } from "components/Common/ModalForm"
import * as Types from "utils/Types"
import { State } from 'reducers'
import { ProfileMenuModalState } from '../profile_menu_modal_reducer'
import { FormData } from '.';

type InitialValues = {
  [key in ProfileMenuModalState]: FormData[]
}

type EditAddFieldArrayMapProps = {
  modal_state: ProfileMenuModalState,
  search_source: string[]
}

type EditAddFieldArrayOwnProps = {
  initialValues: InitialValues,
  changeForm: (field: string, value: string) => void
}

const EditAddFieldArray: React.FunctionComponent<EditAddFieldArrayMapProps & EditAddFieldArrayOwnProps & WrappedFieldArrayProps<FormData>> = ({ modal_state, search_source, initialValues, fields, ...props }) => {

  const [categorys_color, setCategorysColor] = useState({} as Readonly<Types.OverloadObject<Color>>)

  useEffect(() => {
    if (initialValues.edit) {
      fields.map((parametre, index) => {
        setCategorysColor({ [parametre]: { hex: initialValues.edit[index].category_color } })
      })
    }
  }, [])

  function handleChangeColor(parametre: string) {
    return (color: Color) => {
      props.changeForm(`${parametre}.category_color`, color.hex)
      setCategorysColor({ [parametre]: color })
    }
  }

  function onClickOfSearchResult(parametre: string) {
    return (category: string) => {
      props.changeForm(`${parametre}.category`, category)
    }
  }


  return (
    <React.Fragment>
      {modal_state === "add" && <Button onClick={(e) => { e.preventDefault(); fields.push({} as FormData) }} btn="primary" label="Add parameter" />}
      {fields.map((parametre, index) => {

        const category_color = categorys_color[parametre] || { hex: COLOR.GREY }
        let font_and_background_color = _.contrastColorFontAndBackground(category_color)

        return (
          <div className={`ui tertiary inverted segment`} style={{ ...font_and_background_color }} key={index} >

            <Field name={`${parametre}.key`} readonly={!(modal_state === "add")} component={FieldInput} label="key" color={font_and_background_color.color} />
            <Field name={`${parametre}.value`} component={FieldInput} label="value" color={font_and_background_color.color} />
            <Field name={`${parametre}.category`} component={FieldInput} label="category" color={font_and_background_color.color} />

            <ColorPicker default_color={category_color} onChange={handleChangeColor(parametre)} style={{ position: "relative", zIndex: 2, top: "-5.3em", left: "4em" }} />
            <SearchResults getData={() => { return fields.get(index).category }} onClick={onClickOfSearchResult(parametre)} source={search_source} />
          </div>
        )
      })}
    </React.Fragment>
  )
}

function mapStateToProps(state: State): EditAddFieldArrayMapProps {
  return {
    modal_state: state.profile_menu_modal_reducer.modal_state,
    search_source: Object.values(state.parametres_reducer.categorys).map(category => category.key)
  }
}

const ConnectedEditAddFieldArray = connect(mapStateToProps)(EditAddFieldArray) as any

export { ConnectedEditAddFieldArray as EditAddFieldArray }