import React from 'react'
import { connect } from "react-redux"
import { Field, WrappedFieldArrayProps } from "redux-form"

import { Button } from "components/Common/Button"
import { ColorPicker, Color } from "components/Common/ColorPicker"
import { _ } from "utils"
import { COLOR } from "utils/const"
import { SearchResults } from "components/Common/SearchResults"
import { FieldInput } from "components/Common/ModalForm"
import { State } from 'reducers'
import { ProfileMenuModalState } from './edit_add_modal_reducer'
import { FormFields } from '.';
import { CategoryDB } from 'apis';
import { CategorysState } from 'components/Profile/Parametres/parametres_reducer';

type EditAddFieldMapProps = Readonly<{
  modal_state: ProfileMenuModalState,
  search_source: string[],
  default_category: CategoryDB,
  categorys: CategorysState
}>

type EditAddFieldOwnProps = {
  readonly changeForm: (field: string, data: string) => void
}

const EditAddFieldArray: React.FunctionComponent<EditAddFieldMapProps & EditAddFieldOwnProps & WrappedFieldArrayProps<Readonly<FormFields>>> = ({ fields, modal_state, search_source, default_category, categorys, ...props }) => {

  function handleChangeColor(parametre: string): (color: Color) => void {
    return (color) => {
      props.changeForm(`${parametre}.category_color`, color.hex)
    }
  }

  function onClickOfSearchResult(parametre: string): (category: string) => void {
    return (category) => {
      props.changeForm(`${parametre}.category`, category)
      props.changeForm(`${parametre}.category_color`, categorys[_.hashText(category)].color)
    }
  }

  return (
    <React.Fragment>
      {modal_state === "add" && <Button onClick={(e) => { e.preventDefault(); fields.push({ category: default_category.key, category_color: default_category.color } as FormFields) }} btn="primary" label="Add parameter" />}
      {fields.map((parametre, index) => {

        const category_color = { hex: fields.get(index).category_color || COLOR.GREY }
        const font_and_background_color = _.contrastColorFontAndBackground(category_color)

        return (
          <div className={`ui tertiary inverted segment`} style={{ ...font_and_background_color }} key={index} >

            <Field name={`${parametre}.key`} readOnly={!(modal_state === "add")} component={FieldInput} label="key" color={font_and_background_color.color} />
            <Field name={`${parametre}.value`} component={FieldInput} label="value" color={font_and_background_color.color} />
            <Field name={`${parametre}.category`}
              component={FieldInput}
              label="category"
              color={font_and_background_color.color}
              props={{
                ColorPicker: <ColorPicker color={category_color} default_color={category_color} onChange={handleChangeColor(parametre)} style={{ display: "inline", position: "relative", left: "0.3em" }} />
              }}
            />

            <SearchResults
              getData={() => { return fields.get(index).category }}
              onClick={onClickOfSearchResult(parametre)}
              source={search_source}
            />
          </div>
        )
      })}
    </React.Fragment>
  )
}

function mapStateToProps(state: State): EditAddFieldMapProps {
  return {
    modal_state: state.edit_add_modal_reducer.modal_state,
    search_source: Object.values(state.parametres_reducer.categorys).map(category => category.key),
    default_category: state.parametres_reducer.categorys[state.parametres_reducer.default_category_id],
    categorys: state.parametres_reducer.categorys
  }
}

const ConnectedEditAddFieldArray = connect<EditAddFieldMapProps, {}, EditAddFieldOwnProps & WrappedFieldArrayProps<Readonly<FormFields>>, State>(mapStateToProps)(EditAddFieldArray)

export { ConnectedEditAddFieldArray as EditAddFieldArray }