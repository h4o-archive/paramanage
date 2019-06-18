import React from 'react'
import { connect } from "react-redux"
import { Modal, Header } from 'semantic-ui-react'

import { Button } from "components/Common/Button"
import { State } from 'reducers';
import * as Types from "utils/Types"
import { dispatchAction } from "components/actions"
import { HIDE } from 'actions/types';


type DeleteModalMapProps = Readonly<{
  open: boolean,
  modal_delete_info: Types.OverloadObject<string>
}>

type DeleteModalMapActions = {
  readonly dispatchAction: typeof dispatchAction
}

const DeleteModal: React.FunctionComponent<DeleteModalMapProps & DeleteModalMapActions> = ({ open, modal_delete_info, ...props }) => {

  function onClickDiscard() {
    props.dispatchAction(HIDE.MODAL.PARAMETRES)
  }

  return (
    <Modal open={open} onClose={onClickDiscard} basic size='small'>
      <Header icon='trash' content={modal_delete_info.header} />
      <Modal.Content>
        <p>
          Are you sure to delete ? This action cannot be undone
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClickDiscard} label="Discard" />
        <Button onClick={() => console.log("Delete")} btn="negative" label="Delete" />
      </Modal.Actions>
    </Modal>
  )
}

function mapStateToProps(state: State): DeleteModalMapProps {
  return {
    open: state.delete_modal_reducer.open,
    modal_delete_info: state.delete_modal_reducer.data.delete
  }
}

const ConnectedDeleteModal = connect<DeleteModalMapProps, DeleteModalMapActions, {}, State>(mapStateToProps, { dispatchAction })(DeleteModal)

export { ConnectedDeleteModal as DeleteModal }