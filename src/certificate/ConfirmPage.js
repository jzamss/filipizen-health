import React, { useState, useEffect } from 'react'
import {
  Card,
  Panel,
  FormPanel,
  Error,
  Button,
  ActionBar,
  BackLink,
  Spacer,
  Title,
  Label,
  Text,
  Subtitle,
  Subtitle2,
  useData,
  MsgBox
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'

const ConfirmPage = ({ moveNextStep, movePrevStep, appService, title }) => {
  const [ctx] = useData()
  const { app: initialApp } = ctx

  const [error, setError] = useState()
  const [processing, setProcessing] = useState(false)
  const [app, setApp] = useState(initialApp)
  const [showConfirm, setShowConfirm] = useState(false)

  const submit = () => {
    const submittedApp = { objid: app.objid, step: 6 }
    appService.invoke('submit', submittedApp, (err, app) => {
      if (!err) {
        moveNextStep()
      } else {
        setError(err)
        setShowConfirm(false)
      }
    })
  }

  return (
    <Card>
      <Error msg={error} />
      <FormPanel context={app} handler={setApp}>
        <Title>{title}</Title>
        <Subtitle2>Tracking No. {app.controlno}</Subtitle2>
        <Subtitle>Confirmation</Subtitle>
        <ActionBar>
          <BackLink caption='Back' action={movePrevStep} />
          <Button caption='Next' action={() => setShowConfirm(true)} />
        </ActionBar>
      </FormPanel>
      <MsgBox
        open={showConfirm}
        title='New Application Confirmation'
        type='confirm'
        onAccept={submit}
        acceptCaption='Submit Application'
        onCancel={() => setShowConfirm(false)}
      >
        <p>
          Verify that all information in your application are correct and then
          click on Submit Application.
        </p>
      </MsgBox>
    </Card>
  )
}

export default ConfirmPage
