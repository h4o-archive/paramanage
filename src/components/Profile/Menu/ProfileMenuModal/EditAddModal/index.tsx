import React from 'react'
import { connect } from "react-redux"
import { Form, FieldArray, InjectedFormProps, reduxForm } from "redux-form"

import { _, Types } from "utils"
import { FORM_NAME } from "utils/const"
import { ModalForm } from "components/Common/ModalForm"
import { State } from 'reducers'
import { HIDE } from 'actions/types'
import { dispatchAction } from "components/actions"
import { EditAddFieldArray } from "./EditAddFieldArray"
import { ProfileMenuModalState } from './edit_add_modal_reducer';
import { updateParametres } from '../actions';
import { store } from "reducers"

type EditAddModalMapProps = Readonly<{
  open: boolean,
  modal_info: Types.OverloadObject<string>
}>

type EditAddModalMapActions = Readonly<{
  dispatchAction: typeof dispatchAction,
  updateParametres: typeof updateParametres
}>

/**
 * 
 * @description Edit or Add modal of parameters in Profile page 
 */
const EditAddModal: React.FunctionComponent<EditAddModalMapProps & EditAddModalMapActions & InjectedFormProps<FormValues, EditAddModalMapProps & EditAddModalMapActions>> = ({ open, modal_info, ...props }) => {

  function onClickDiscard(): void {
    props.dispatchAction(HIDE.MODAL.PARAMETRES)
    props.reset()
  }

  function onSubmit(form_values: FormValues): void {
    props.updateParametres((form_values[modal_info.key as ProfileMenuModalState] as FormFields[]))
    onClickDiscard()
  }

  return (
    <ModalForm open={open} form_name={FORM_NAME.EDIT_ADD_MODAL} onClickDiscard={onClickDiscard} header={modal_info.header}>
      <Form className="ui form error" onSubmit={props.handleSubmit(onSubmit)} >
        {/* TODO make pull request change type definition for FieldArray */}
        <FieldArray name={modal_info.key} component={EditAddFieldArray} props={{ changeForm: props.change }} />
      </Form>
    </ModalForm>
  )
}

// no return type because of not well supported redux-form Typescript
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
    open: state.edit_add_modal_reducer.open,
    modal_info: state.edit_add_modal_reducer.data[state.edit_add_modal_reducer.modal_state],
    initialValues,
    enableReinitialize: SVGComponentTransferFunctionElement
  }
}

type Errors = {
  [key in ProfileMenuModalState]?: FormFields[]
}

// return any to be compatible with reduxForm. Current version of FormErrors Redux do not support FieldArray form values
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
        if (store.getState().edit_add_modal_reducer.modal_state === "add" && property === "key" && (form_values[key] as FormFields[])[i][property]) {
          if (store.getState().parametres_reducer.parametres[_.hashText((form_values[key] as FormFields[])[i][property])]) parametre_error[property] = "Parametre already exist in this profile. Please chose another name or modify existence"
        }
      }
      modal_state_error[i] = parametre_error
    }
    errors[key] = modal_state_error
  }

  return errors
}

const ConnectedEditAddModal = connect<EditAddModalMapProps, EditAddModalMapActions, {}, State>(mapStateToProps, { dispatchAction, updateParametres })(
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

export type FormValues = {
  readonly [key in ProfileMenuModalState]?: Readonly<FormFields>[]
}