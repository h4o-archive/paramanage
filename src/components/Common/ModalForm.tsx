import React from 'react'
import { Modal } from 'semantic-ui-react'

import { Button } from "./Button"

type FieldInputProps = Readonly<{
  input?: any,
  label?: string,
  meta: Readonly<{
    error?: any,
    touched?: boolean
  }>
}>
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

type ModalFormProps = Readonly<{
  open: boolean,
  header?: string,
  onClickDiscard?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}>
/**
 *
 * @description modal with Form
 */
export const ModalForm: React.FunctionComponent<ModalFormProps> = ({ open = false, header, children: Form, onClickDiscard, onSubmit, handleSubmit }) => {
  return (
    <Modal open={open} onClose={onClickDiscard}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <form className="ui form error" onSubmit={handleSubmit} >
            {Form}
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