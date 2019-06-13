import React from 'react'
import { Dispatch } from 'redux';
import { connect } from "react-redux"
import { Field, reduxForm, formValueSelector, getFormSyncErrors, reset, InjectedFormProps } from "redux-form"

import { dispatchAction } from "components/actions"
import { HIDE } from "actions/types"
import { __parseStandarlizeVersionOrder__ } from "components/Dashboard/Add/actions"
import { add } from "./actions"
import { api } from 'apis';
import { FieldInput, ModalForm } from "components/Common/ModalForm"
import { ModalState } from './dashboard_add_modal_reducer';
import { State } from 'reducers';
import { _ } from "utils"
import { DASHBOARD_ADD_MODAL_STATE, FORM_NAME } from "utils/const"

type Errors = {
  [keys in ModalState]: string
}

type FormValues = Errors

type DashboardAddModalProps = Readonly<{
  open: boolean,
  modal_state: ModalState,
  modal_info: _.type.Object,
  form_values: string,
  errors: Readonly<Errors>,
  selected_platform: string,
  add: typeof add,
  dispatchAction: typeof dispatchAction,
}>
/**
 * @description React Component - Modal when click on Add on Home Page
 */
let DashboardAddModal: React.FunctionComponent<DashboardAddModalProps & InjectedFormProps<FormValues, DashboardAddModalProps>> = ({ open, modal_state, modal_info, form_values, errors, ...props }) => {

  function onSubmit() {
    if (_.isEmpty(errors)) {
      props.add(modal_state, form_values)
      onClickDiscard()
    }
  }

  function onClickDiscard() {
    props.dispatchAction(HIDE.MODAL.DASHBOARD_ADDING)
    props.reset()
  }

  return (

    <ModalForm open={open}
      onClickDiscard={onClickDiscard}
      onSubmit={onSubmit}
      handleSubmit={props.handleSubmit(onSubmit)}
      header={modal_info.header}
    >
      <Field name={modal_info.key} component={FieldInput}
        label={`Enter ${modal_state.charAt(0).toUpperCase() + modal_state.slice(1)}`}
      />
    </ModalForm>

  )
}

function validate(form_values: Readonly<FormValues>): Errors {
  let errors = {} as Errors

  if (form_values.version && ! /^[0-9]{1,2}.[0-9]{1,2}.0{1,2}$/.test(form_values.version)) {
    errors.version = "ERROR: FORMAT ERROR, please type the version as XX.XX.00 ! NOTE: Only the creation of a major version is supported at the moment"
  }

  return errors;
}

function asyncValidate(form_values: Readonly<FormValues>, dispatch: Dispatch, { modal_state, selected_platform }: Readonly<DashboardAddModalProps>): Promise<any> {
  if (form_values) {

    let id = _.hashText(form_values[modal_state])
    if (form_values.version) {
      let parsed = __parseStandarlizeVersionOrder__(form_values[modal_state])
      id = `${selected_platform}${parsed}`
    }

    return (
      api.get({ url: `/${modal_state}s`, id })
        .then(() => {
          throw { [modal_state]: `This ${modal_state} already exist` }
        })
        .catch(e => {
          if (e[modal_state]) throw e
          if (e.response.status !== 404) throw { [modal_state]: "Something wrong happened, please try again later" }
        })
    )
  }
  return Promise.resolve("No error")
}


function mapStateToProps(state: State): DashboardAddModalProps {
  let { open, modal_state, data } = state.dashboard_add_modal_reducer
  return {
    open,
    modal_state,
    modal_info: data[modal_state],
    form_values: formValueSelector(FORM_NAME.DASHBOARD_ADD_MODAL)(state, data[modal_state].key),
    // TODO fix type error
    errors: getFormSyncErrors(FORM_NAME.DASHBOARD_ADD_MODAL)(state),
    selected_platform: state.metadatas_reducer.platforms.selected
  }
}

DashboardAddModal = connect(mapStateToProps, { dispatchAction, add })(
  reduxForm<FormValues, DashboardAddModalProps>({
    form: FORM_NAME.DASHBOARD_ADD_MODAL,
    validate,
    asyncValidate,
    asyncBlurFields: Object.values(DASHBOARD_ADD_MODAL_STATE)
  })(DashboardAddModal) as any
) as any
export { DashboardAddModal }