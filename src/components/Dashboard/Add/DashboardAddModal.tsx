import React from 'react'
import { Dispatch } from 'redux';
import { connect } from "react-redux"
import { Form, Field, reduxForm, InjectedFormProps, FormErrors as ReduxFormErrors } from "redux-form"

import { dispatchAction } from "components/actions"
import { HIDE } from "actions/types"
import { __parseStandarlizeVersionOrder__ } from "components/Dashboard/Add/actions"
import { add } from "./actions"
import { api } from 'apis';
import { FieldInput, ModalForm } from "components/Common/ModalForm"
import { DashboardAddModalState } from './dashboard_add_modal_reducer';
import { State } from 'reducers';
import { _, Types } from "utils"
import { DASHBOARD_ADD_MODAL_STATE, FORM_NAME } from "utils/const"

// NOT READ-ONLY because of modification errors object in validate function
type FormValues = {
  [keys in DashboardAddModalState]: string
}

type FormErrors = ReduxFormErrors<FormValues, string>

type DashboardAddModalMapProps = Readonly<{
  open: boolean,
  modal_state: DashboardAddModalState,
  modal_info: Types.OverloadObject
  selected_platform: string
}>

type DashboardAddModalMapActions = Readonly<{
  add: typeof add,
  dispatchAction: typeof dispatchAction,
}>
/**
 * @description Modal when click on Add on Home Page
 */
const DashboardAddModal: React.FunctionComponent<DashboardAddModalMapProps & DashboardAddModalMapActions & InjectedFormProps<Readonly<FormValues>, DashboardAddModalMapProps & DashboardAddModalMapActions>> = ({ open, modal_state, modal_info, ...props }) => {

  function onSubmit(form_values: Readonly<FormValues>, dispatch: Dispatch, ownProps: DashboardAddModalMapProps): void {
    props.add(ownProps.modal_state, form_values[ownProps.modal_state])
    onClickDiscard()
  }

  function onClickDiscard(): void {
    props.dispatchAction(HIDE.MODAL.DASHBOARD_ADDING)
    props.reset()
  }

  return (

    <ModalForm
      open={open}
      form_name={FORM_NAME.DASHBOARD_ADD_MODAL}
      header={modal_info.header}
      onClickDiscard={onClickDiscard}
    >
      <Form className="ui form error" onSubmit={props.handleSubmit(onSubmit)} >
        <Field name={modal_info.key} component={FieldInput}
          label={`Enter ${modal_state.charAt(0).toUpperCase() + modal_state.slice(1)}`}
        />
      </Form>
    </ModalForm>

  )
}

function validate(form_values: Readonly<FormValues>): Readonly<FormErrors> {
  let errors = {} as FormErrors

  if (form_values.version && ! /^[0-9]{1,2}.[0-9]{1,2}.0{1,2}$/.test(form_values.version)) {
    errors.version = "ERROR: FORMAT ERROR, please type the version as XX.XX.00 ! NOTE: Only the creation of a major version is supported at the moment"
  }

  return errors;
}

function asyncValidate(form_values: Readonly<FormValues>, dispatch: Dispatch, { modal_state, selected_platform }: Readonly<DashboardAddModalMapProps>): Promise<any> {
  if (form_values) {

    let id = _.hashText(form_values[modal_state])
    if (form_values.version) {
      const parsed = __parseStandarlizeVersionOrder__(form_values[modal_state])
      id = `${selected_platform}${parsed}`
    }

    return (
      api.get({ url: `/${modal_state}s`, id }).then((response) => {
        // eslint-disable-next-line no-throw-literal
        if (response.error && response.error.response.status !== 404) throw { [modal_state]: "Something wrong happened, please try again later" }
        // eslint-disable-next-line no-throw-literal
        else if (!_.isEmpty(response.data)) throw { [modal_state]: `This ${modal_state} already exist` }
      })
    )
  }
  return Promise.resolve("No error")
}


function mapStateToProps(state: State): DashboardAddModalMapProps {
  const { open, modal_state, data } = state.dashboard_add_modal_reducer
  return {
    open,
    modal_state,
    modal_info: data[modal_state],
    selected_platform: state.metadatas_reducer.platforms.selected
  }
}

const ConnectedDashboardAddModal = connect<DashboardAddModalMapProps, DashboardAddModalMapActions, {}, State>(mapStateToProps, { dispatchAction, add })(
  reduxForm<Readonly<FormValues>, DashboardAddModalMapProps & DashboardAddModalMapActions>({
    form: FORM_NAME.DASHBOARD_ADD_MODAL,
    validate,
    asyncValidate,
    asyncBlurFields: Object.values(DASHBOARD_ADD_MODAL_STATE)
  })(DashboardAddModal)
)
export { ConnectedDashboardAddModal as DashboardAddModal }