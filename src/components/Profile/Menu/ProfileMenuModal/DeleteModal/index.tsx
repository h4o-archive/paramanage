import React from 'react'
import { connect } from "react-redux"
import { Modal, Header } from 'semantic-ui-react'

import { Button } from "components/Common/Button"
import { State } from 'reducers';
import * as Types from "utils/Types"

type DeleteModalMapProps = Readonly<{
  open: boolean,
  modal_delete_info: Types.OverloadObject<string>
}>

type DeleteModalOwnProps = Readonly<{
  onClose: ((event: React.MouseEvent<HTMLButtonElement | HTMLElement, MouseEvent>) => void)
  onDelete: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
}>

const DeleteModal: React.FunctionComponent<DeleteModalMapProps & DeleteModalOwnProps> = ({ open, modal_delete_info, ...props }) => {
  return (
    <Modal open={open} onClose={props.onClose} basic size='small'>
      <Header icon='trash' content={modal_delete_info.header} />
      <Modal.Content>
        <p>
          Are you sure to delete ? This action cannot be undone
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose} label="Discard" />
        <Button onClick={props.onDelete} btn="negative" label="Delete" />
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

const ConnectedDeleteModal = connect<DeleteModalMapProps, {}, DeleteModalOwnProps, State>(mapStateToProps)(DeleteModal)

export { ConnectedDeleteModal as DeleteModal }