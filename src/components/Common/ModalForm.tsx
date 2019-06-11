import React from 'react'
import { Modal, ModalProps } from 'semantic-ui-react'

import { Button } from "./Button"
import { _ } from "utils"

type FieldInputProps = {
  readonly input?: any,
  readonly label?: string,
  readonly meta: {
    readonly error?: any,
    readonly touched?: boolean
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

type ModalFormProps = {
  readonly open: boolean,
  readonly header?: string,
  readonly children?: React.ReactChildren
  readonly onClickDiscard?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  readonly onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  readonly handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
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