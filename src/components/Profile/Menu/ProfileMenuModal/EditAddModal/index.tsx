import React from 'react'
import { connect } from "react-redux"
import { Form, FieldArray, InjectedFormProps, reduxForm } from "redux-form"

import { _ } from "utils"
import { FORM_NAME } from "utils/const"
import { ModalForm } from "components/Common/ModalForm"
import * as Types from "utils/Types"
import { State } from 'reducers'
import { HIDE } from 'actions/types'
import { dispatchAction } from "components/actions"
import { EditAddFieldArray } from "./EditAddFieldArray"
import { ProfileMenuModalState } from './edit_add_modal_reducer';

type EditAddModalMapProps = Readonly<{
  open: boolean,
  modal_info: Types.OverloadObject<string>,
}>

type EditAddModalMapActions = Readonly<{
  dispatchAction: typeof dispatchAction
}>

type FormValues = {
  readonly [key in ProfileMenuModalState]?: Readonly<FormFields>[]
}

const EditAddModal: React.FunctionComponent<EditAddModalMapProps & EditAddModalMapActions & InjectedFormProps<FormValues, EditAddModalMapProps & EditAddModalMapActions>> = ({ open, modal_info, ...props }) => {

  function onClickDiscard() {
    props.dispatchAction(HIDE.MODAL.PARAMETRES)
    props.reset()
  }

  function onSubmit(form_values: FormValues): void {
    console.log("TCL: form_values", form_values)
  }

  return (
    <ModalForm open={open} form_name={FORM_NAME.EDIT_ADD_MODAL} onClickDiscard={onClickDiscard} header={modal_info.header}>
      <Form className="ui form error" onSubmit={props.handleSubmit(onSubmit)} >
        // TODO make pull request change type definition for FieldArray
        <FieldArray name={modal_info.key} component={EditAddFieldArray} props={{ changeForm: props.change }} />
      </Form>
    </ModalForm>
  )
}

function mapStateToProps(state: State) {

  const modal_info = state.edit_add_modal_reducer.data[state.edit_add_modal_reducer.modal_state]

  let initialValues = {} as { edit: FormFields[] }
  if (modal_info.key === "edit") {
    const { parametres, categorys } = state.parametres_reducer
    initialValues = { edit: [] as FormFields[] }
    initialValues.edit = _.map(state.parametres_reducer.selected, (parametre, key) => {
      return {
        key: parametres[key].key,
        value: parametres[key].value,
        category: categorys[parametres[key].categoryId].key,
        category_color: categorys[parametres[key].categoryId].color
      }
    })
  }

  return {
    initialValues,
    open: state.edit_add_modal_reducer.open,
    modal_info: state.edit_add_modal_reducer.data[state.edit_add_modal_reducer.modal_state],
  }
}

type Errors = {
  [key in ProfileMenuModalState]?: FormFields[]
}

function validate(form_values: FormValues): any {
  let errors = {} as Errors

  let key: keyof FormValues
  for (key in form_values) {
    let modal_state_error = [] as Readonly<FormFields>[]
    for (let i = 0; i < (form_values[key] as FormFields[]).length; i++) {
      let parametre_error = {} as FormFields
      let property: keyof FormFields
      for (property in { key: null, value: null, category: null, category_color: null }) {
        if (!(form_values[key] as FormFields[])[i][property] || (form_values[key] as FormFields[])[i][property] === "") {
          parametre_error[property] = "Required"
        }
      }
      modal_state_error[i] = parametre_error
    }
    errors[key] = modal_state_error
  }

  return errors
}

const ConnectedEditAddModal = connect<EditAddModalMapProps, EditAddModalMapActions, {}, State>(mapStateToProps, { dispatchAction })(
  reduxForm<FormValues, EditAddModalMapProps & EditAddModalMapActions>({
    form: FORM_NAME.EDIT_ADD_MODAL,
    validate
  })(EditAddModal)
)

export { ConnectedEditAddModal as EditAddModal }

export type FormFields = {
  key: string,
  value: string
  category: string,
  category_color: string
}