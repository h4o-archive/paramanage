import React, { useState, useEffect } from 'react'
import { Dropdown as SemanticDropdown } from 'semantic-ui-react'
import { connect } from "react-redux"
import { Form, Field, reduxForm, InjectedFormProps, formValueSelector, FormErrors, getFormMeta } from "redux-form"

import { dispatchAction } from "components/actions"
import { HIDE } from "actions/types"
import { SearchResults } from "components/Common/SearchResults"
import { api, ProfileDB, MutualProfileDB } from "apis"
import { State } from 'reducers';
import { ConfigEditing } from './edit_config_modal_reducer';
import { ModalForm, FieldInput } from 'components/Common/ModalForm';
import { FORM_NAME, CONFIG_STATUS } from 'utils/const';
import { _ } from "utils"
import { store } from "reducers"
// import { updateConfig } from "./actions"

type EditConfigModalMapProps = {
  open: boolean,
  header: string,
  config: ConfigEditing
}

type EditConfigModalMapActions = {
  dispatchAction: typeof dispatchAction
}

const EditConfigModal: React.FunctionComponent<EditConfigModalMapProps & EditConfigModalMapActions & InjectedFormProps<FormValues, EditConfigModalMapProps & EditConfigModalMapActions>> = ({ open, header, config, ...props }) => {

  const [source_mutual_profiles, setSourceMutualProfiles] = useState([] as string[])
  const [source_profiles, setSourceProfiles] = useState([] as string[])
  const [focus, setFocus] = useState("")

  async function fetchSearchSources(): Promise<void> {
    const { data: profiles } = await api.get({ url: "/profiles" })
    const { data: mutual_profiles } = await api.get({ url: "/mutual_profiles" })
    const source_mutual_profiles = mutual_profiles.map(mutual_profile => (mutual_profile as MutualProfileDB).key)
    const source_profiles = profiles.reduce((source_profiles, profile) => {
      if (!source_mutual_profiles.includes((profile as ProfileDB).key)) source_profiles.push((profile as ProfileDB).key)
      return source_profiles
    }, [] as string[])
    setSourceMutualProfiles(source_mutual_profiles)
    setSourceProfiles(source_profiles)
  }

  useEffect(() => {
    fetchSearchSources()
  }, [])

  function onSubmit(form_values: FormValues): void {
    // props.updateConfig(this.state, this.props.config_or_plage)
    onClickDiscard()
  }

  function onClickDiscard(): void {
    props.dispatchAction(HIDE.MODAL.EDIT_CONFIG)
    props.reset()
  }

  function getField(field: string) {
    return formValueSelector(FORM_NAME.EDIT_CONFIG_MODAL)(store.getState(), field)
  }

  return (
    <ModalForm
      open={open}
      form_name={FORM_NAME.EDIT_CONFIG_MODAL}
      header={header}
      onClickDiscard={onClickDiscard}
    >
      <Form className="ui form error" onSubmit={props.handleSubmit(onSubmit)} >
        <label>Status</label>
        <SemanticDropdown
          fluid
          search
          selection
          options={_.map(CONFIG_STATUS, (status) => { return { value: status.value, text: status.text } })}
          onChange={(e, { value }) => { props.change("status", value as string) }}
          value={getField("status")}
        />
        <Field name={"status"} style={{ display: "none" }} component={FieldInput} label={`Status`} />
        <Field onFocus={() => setFocus("profile")} autoComplete="off" name={"profile"} component={FieldInput} label={`Profile`} />
        {focus === "profile" && <SearchResults style={{ position: "relative", top: "-1em" }} getData={() => { return getField("profile") }} source={source_profiles} onClick={(data) => props.change("profile", data)} />}
        <Field onFocus={() => setFocus("mutual_profile")} autoComplete="off" name={"mutual_profile"} component={FieldInput} label={`Mutual Profile`} />
        {focus === "mutual_profile" && <SearchResults style={{ position: "relative", top: "-1em" }} getData={() => { return getField("mutual_profile") }} source={source_mutual_profiles} onClick={(data) => props.change("mutual_profile", data)} />}
      </Form>
    </ModalForm>
  )
}

function validate(form_values: FormValues): FormErrors<FormValues, string> {
  let errors = {} as FormErrors<FormValues, string>

  if (form_values) {
    if (form_values.status === "") errors.status = "REQUIRED"
    if (form_values.profile === "") errors.profile = "REQUIRED"
    if (form_values.mutual_profile === "") errors.mutual_profile = "REQUIRED"
  }
  return errors
}

function mapStateToProps(state: State) {
  const { open, header, config } = state.edit_config_modal_reducer
  return {
    open,
    header,
    config,
    initialValues: {
      status: config.status,
      profile: config.profile,
      mutual_profile: config.mutual_profile
    },
    enableReinitialize: SVGComponentTransferFunctionElement
  }
}

const ConnectEditConfigModal = connect<EditConfigModalMapProps, EditConfigModalMapActions, {}, State>(mapStateToProps, { dispatchAction })(
  reduxForm<FormValues, EditConfigModalMapProps & EditConfigModalMapActions>({
    form: FORM_NAME.EDIT_CONFIG_MODAL,
    validate
  })(EditConfigModal)
)

export { ConnectEditConfigModal as EditConfigModal }

export type FormValues = {
  status: string,
  profile: string,
  mutual_profile: string
}