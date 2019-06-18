import React from 'react'
import { connect } from "react-redux"

import { FORM_NAME } from "utils/const"
import { ModalForm } from "components/Common/ModalForm"
import * as Types from "utils/Types"
import { State } from 'reducers'
import { EditAddFieldArray } from "./EditAddFieldArray"
import { HIDE } from 'actions/types';
import { reset } from "redux-form"
import { dispatchAction } from "components/actions"

type EditAddModalMapProps = Readonly<{
  open: boolean,
  modal_info: Types.OverloadObject<string>,
}>

type EditAddModalMapActions = Readonly<{
  reset: typeof reset,
  dispatchAction: typeof dispatchAction
}>

const EditAddModal: React.FunctionComponent<EditAddModalMapProps & EditAddModalMapActions> = ({ open, modal_info, ...props }) => {

  function onClickDiscard() {
    props.dispatchAction(HIDE.MODAL.PARAMETRES)
    props.reset(FORM_NAME.EDIT_ADD_MODAL)
  }

  return (
    <ModalForm
      open={open}
      form_name={FORM_NAME.EDIT_ADD_MODAL}
      onClickDiscard={onClickDiscard}
      header={modal_info.header}
    >
      <EditAddFieldArray />
    </ModalForm>
  )
}

function mapStateToProps(state: State) {
  return {
    open: state.edit_add_modal_reducer.open,
    modal_info: state.edit_add_modal_reducer.data[state.edit_add_modal_reducer.modal_state],
  }
}

const ConnectedEditAddModal = connect<EditAddModalMapProps, EditAddModalMapActions, {}, State>(mapStateToProps, { reset, dispatchAction })(EditAddModal)
export { ConnectedEditAddModal as EditAddModal }