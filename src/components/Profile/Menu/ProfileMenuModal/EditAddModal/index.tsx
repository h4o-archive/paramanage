import React from 'react'
=import { connect } from "react-redux"
import { reduxForm, FieldArray, InjectedFormProps } from "redux-form"

import { FORM_NAME } from "utils/const"
import { _ } from "utils"
import { ModalForm } from "components/Common/ModalForm"
import * as Types from "utils/Types"
import { State } from 'reducers'
import { EditAddFieldArray } from "./EditAddFieldArray"
import { ParametreDB } from 'apis';

type EditAddModalMapProps = {
  readonly modal_info: Types.OverloadObject<string>,
}

const EditAddModal: React.FunctionComponent<EditAddModalMapProps & InjectedFormProps<any, EditAddModalMapProps>> = ({ open, modal_info, initialValues, ...props }) => {
  return (
    <ModalForm open={open}
      onClickDiscard={props.onClose}
      onSubmit={props.onSubmit}
      handleSubmit={props.handleSubmit(props.onSubmit)}
      header={modal_info.header}
    >
      <FieldArray name={modal_info.key} component={EditAddFieldArray} props={{ initialValues, changeForm: props.change }} />
    </ModalForm>
  )
}

function mapStateToProps(state: State) {

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
    modal_info: state.profile_menu_modal_reducer.data[state.profile_menu_modal_reducer.modal_state],
  }
}

connect<EditAddModalMapProps, {}, {}, State>(mapStateToProps)(
  reduxForm<any, EditAddModalMapProps>({
    form: FORM_NAME.DASHBOARD_ADD_MODAL
  })(EditAddModal)
)

export type FormData = ParametreDB & Readonly<{ category: string, category_color: string }>