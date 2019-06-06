import React, { Children } from 'react'
import { Modal } from 'semantic-ui-react'

import { Button } from "./Button"
import { _ } from "utils"

interface FieldInputProps {
  input?: any,
  label?: string,
  meta: {
    error?: any,
    touched?: boolean
  }
}
/**
 *
 * @description input for Redux Field
 */
export const FieldInput: React.FunctionComponent<FieldInputProps> = ({ input, label, meta: { error, touched } }) => {
  return (
    <React.Fragment>
      <label>{label}</label>
      <input {...input} />
      {touched && error &&
        <div className="ui error message" >
          <p>{error}</p>
        </div>
      }
    </React.Fragment>
  )
}

interface ModalFormProps {
  open: boolean,
  header?: string,
  children?: React.ReactChildren
  onClickDiscard?: _.type.func,
  onSubmit?: _.type.func,
  handleSubmit?: _.type.func
}
/**
 *
 * @description modal with Form
 */
export const ModalForm: React.FunctionComponent<ModalFormProps> = ({ open = false, header, children, onClickDiscard, onSubmit, handleSubmit }) => {
  return (
    <Modal open={open} onClose={onClickDiscard}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <form className="ui form error" onSubmit={handleSubmit} >
            {children}
          </form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClickDiscard} label="Discard" />
        <Button onClick={onSubmit} btn="primary" label="Save" />
      </Modal.Actions>
    </Modal>
  )
}