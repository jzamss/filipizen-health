import React, { useState, useRef } from 'react'
import {
  Card,
  BackLink,
  FormPanel,
  Error,
  Button,
  ActionBar,
  Title,
  Subtitle,
  Subtitle2,
  useData,
  Spacer,
  Radio,
  Item,
  Text,
  Checkbox,
  Email,
  Mobileno,
  PhoneNo,
  Panel
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'
import { dispatch } from 'rxjs/internal/observable/pairs'
import { ACTIONS } from './reducer'

import { LocalAddress, NonLocalAddress, IdEntry } from 'rsi-react-filipizen-components'

const PersonalInfoPage = ({ partner, moveNextStep, movePrevStep, appService, page, title }) => {
  const [ctx, dispatch] = useData()
  const { app: initialApp } = ctx

  const [error, setError] = useState()
  const [hasError, setHasError] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [app, setApp] = useState(initialApp)
  const [applicant, setApplicant] = useState({ ...initialApp.applicant, entitytype: 'INDIVIDUAL' })
  const [mode, setMode] = useState('personalinfo')

  const formRef = useRef()

  const validateFilipizenId = () => {
    setError('')
    if (
      applicant.hasfilipizenid === 'YES' &&
      (!applicant.filipizenid || applicant.filipizenid.trim().length == 0)
    ) {
      setError('Filipizen ID is required')
      return
    }

    dispatch({ type: ACTIONS.SET_APP, app: { ...app, applicant } })
    setMode('personalinfo')
  }

  const residentHandler = () => {
    const updatedApplicant = {
      ...applicant,
      appid: app.objid,
      resident: !applicant.resident,
      address: {}
    }
    setApplicant(updatedApplicant)
  }

  const onError = (error) => {
    setHasError(error)
  }

  const saveApplicant = () => {
    if (!hasError && formRef.current.reportValidity()) {
      setError('')
      setProcessing(true)
      const updatedApplicant = { ...applicant, appid: app.objid, step: page.step }
      appService.invoke('saveApplicant', updatedApplicant, (err, applicant) => {
        if (err) {
          setError(err)
        } else {
          dispatch({ type: ACTIONS.SET_APP, app: { ...app, applicant } })
          moveNextStep()
        }
        setProcessing(false)
      })
    }
  }

  return (
    <Card>
      <FormPanel context={applicant} handler={setApplicant} visibleWhen={mode === 'filipizenid'}>
        <Title>{title}</Title>
        <Subtitle2>Tracking No. {app.appno}</Subtitle2>
        <Subtitle>Personal Information</Subtitle>
        <Spacer />
        <h4>Do you have a Filipizen ID?</h4>
        <Radio name='hasfilipizenid'>
          <Item caption='No' value='NO' />
          <Item caption='Yes' value='YES' />
        </Radio>
        {applicant.hasfilipizenid === 'YES' && (
          <React.Fragment>
            <Spacer />
            <Text
              caption='Enter Filipizen ID'
              name='filipizenid'
              required
              autoFocus={true}
              variant='outlined'
              error={error}
              helperText={error}
            />
          </React.Fragment>
        )}
        <ActionBar>
          <BackLink caption='Back' action={movePrevStep} />
          <Button caption='Next' action={validateFilipizenId} />
        </ActionBar>
      </FormPanel>

      <form ref={formRef}>
        <FormPanel context={applicant} handler={setApplicant} visibleWhen={mode === 'personalinfo'}>
          <Title>{title}</Title>
          <Subtitle2>Tracking No. {app.appno}</Subtitle2>
          <Subtitle>Personal Information</Subtitle>
          <Spacer />
          <Error msg={error} />
          <Panel>
            <Text caption='Last Name' name='lastname' required={true} />
            <Text caption='First Name' name='firstname' required={true} />
            <Text caption='Middle Name' name='middlename' required={true} />
            <Text caption='TIN' name='tin' />
            <Email name='email' required={true} />
            <Mobileno name='mobileno' required={true} />
            <PhoneNo name='phoneno' />
          </Panel>

          <Spacer />
          <Subtitle2>Applicant Address</Subtitle2>
          <Checkbox caption='Resident' name='resident' onChange={residentHandler} />
          {applicant.resident ? (
            <LocalAddress orgcode={partner.id} name='address' caption='Address' />
          ) : (
            <NonLocalAddress name='address' caption='Address' />
          )}
          <Spacer />
          <Subtitle2>Proof of Identity</Subtitle2>
          <IdEntry name='id' onError={onError} dtIssued={applicant.id.dtissued} />

          <ActionBar>
            <BackLink caption='Back' action={() => setMode('filipizenid')} />
            <Button
              caption='Next'
              action={saveApplicant}
              processing={processing}
              disableWhen={processing}
            />
          </ActionBar>
        </FormPanel>
      </form>
    </Card>
  )
}

export default PersonalInfoPage
