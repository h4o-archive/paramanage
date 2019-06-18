import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Field, WrappedFieldArrayProps, Form, FieldArray as ReduxFieldArray, InjectedFormProps, reduxForm } from "redux-form"

import { Button } from "components/Common/Button"
import { ColorPicker, Color } from "components/Common/ColorPicker"
import { _ } from "utils"
import { COLOR, FORM_NAME } from "utils/const"
import { SearchResults } from "components/Common/SearchResults"
import { FieldInput } from "components/Common/ModalForm"
import * as Types from "utils/Types"
import { State } from 'reducers'
import { ProfileMenuModalState } from './edit_add_modal_reducer'
import { ParametreDB } from 'apis';

export type FormData = ParametreDB & Readonly<{ category: string, category_color: string }>
type InitialValues = {
  [key in ProfileMenuModalState]?: FormData[]
}

type EditAddFieldArrayMapProps = {
  workaround_init_values: InitialValues,
  modal_state: ProfileMenuModalState,
  search_source: string[]
}

const EditAddFieldArray: React.FunctionComponent<EditAddFieldArrayMapProps & InjectedFormProps<Readonly<Types.OverloadObject<string>>, EditAddFieldArrayMapProps>> = ({ modal_state, search_source, workaround_init_values, ...props }) => {

  function onSubmit(form_values: any): void {
  }

  const FieldArray: React.FunctionComponent<WrappedFieldArrayProps<FormData>> = ({ fields }) => {

    function handleChangeColor(parametre: string) {
      return (color: Color) => {
        props.change(`${parametre}.category_color`, color.hex)
      }
    }

    function onClickOfSearchResult(parametre: string) {
      return (category: string) => {
        props.change(`${parametre}.category`, category)
      }
    }

    return (
      <React.Fragment>
        {modal_state === "add" && <Button onClick={(e) => { e.preventDefault(); fields.push({ category_color: COLOR.GREY } as FormData) }} btn="primary" label="Add parameter" />}
        {fields.map((parametre, index) => {

          const category_color = { hex: fields.get(index).category_color || COLOR.GREY }
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

  return (
    <Form className="ui form error" onSubmit={props.handleSubmit(onSubmit)} >
      <ReduxFieldArray name={modal_state} component={FieldArray} />
    </Form>
  )
}

function mapStateToProps(state: State): EditAddFieldArrayMapProps & { initialValues: any } {
  const { parametres, categorys } = state.parametres_reducer

  let initialValues = { edit: [] as FormData[] }
  initialValues.edit = _.map(state.parametres_reducer.selected, (parametre, key) => {
    return {
      ...parametres[key],
      category: categorys[parametres[key].categoryId].key,
      category_color: categorys[parametres[key].categoryId].color
    }
  })

  return {
    initialValues,
    workaround_init_values: { ...initialValues },
    modal_state: state.edit_add_modal_reducer.modal_state,
    search_source: Object.values(state.parametres_reducer.categorys).map(category => category.key)
  }
}

const ConnectedEditAddFieldArray = connect(mapStateToProps)(
  reduxForm<Readonly<Types.OverloadObject<string>>, EditAddFieldArrayMapProps>({
    form: FORM_NAME.EDIT_ADD_MODAL
  })(EditAddFieldArray)
)

export { ConnectedEditAddFieldArray as EditAddFieldArray }