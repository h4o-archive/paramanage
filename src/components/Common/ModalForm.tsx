import React from 'react'
import { Modal } from 'semantic-ui-react'
import { connect } from "react-redux"
import { submit } from "redux-form"

import { Button } from "./Button"
import { ColorPicker } from './ColorPicker';

type FieldInputProps = Readonly<{
  input?: any,
  label?: string,
  meta: Readonly<{
    error?: any,
    touched?: boolean
  }>,
  color?: string
  readOnly?: boolean,
  ColorPicker?: React.ReactNode,
  autoComplete?: string
}>
/**
 *
 * @description input for Redux Field
 */
export const FieldInput: React.FunctionComponent<FieldInputProps> = ({ input, label, autoComplete, meta: { error, touched }, color, readOnly, ColorPicker, ...props }) => {
  return (
    <div className="field" {...props}>
      <label style={{ color }}>{label} {ColorPicker}</label>
      <input autoComplete={autoComplete} readOnly={readOnly || false} {...input} />
      {touched && error &&
        <div className="ui error message" >
          <p>{error}</p>
        </div>
      }
    </div>
  )
}

type ModalFormMapActions = {
  readonly submit: typeof submit
}

type ModalFormOwnProps = Readonly<{
  open: boolean,
  header?: string,
  form_name: string,
  onClickDiscard?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}>
/**
 *
 * @description modal with Redux-Form
 */
const ModalForm: React.FunctionComponent<ModalFormMapActions & ModalFormOwnProps> = ({ open = false, form_name, header, children: Form, onClickDiscard, ...props }) => {
  return (
    <Modal open={open} onClose={onClickDiscard}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {Form}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClickDiscard} label="Discard" />
        <Button onClick={() => props.submit(form_name)} btn="primary" label="Save" />
      </Modal.Actions>
    </Modal>
  )
}

const ConnectedModalForm = connect<{}, ModalFormMapActions, ModalFormOwnProps, {}>(null, { submit })(ModalForm)
export { ConnectedModalForm as ModalForm }