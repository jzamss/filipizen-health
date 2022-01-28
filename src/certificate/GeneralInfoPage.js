import React, { useState, useEffect } from 'react'
import {
  Card,
  FormPanel,
  Error,
  Button,
  ActionBar,
  Title,
  Subtitle,
  Subtitle2,
  Spacer,
  useData,
  Text,
  BackLink
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'
import { ACTIONS } from './reducer'

const GeneralInfoPage = ({
  moveNextStep,
  appService,
  stepCompleted,
  page,
  history,
  title
}) => {
  const [ctx, dispatch] = useData()
  const { app: initialApp } = ctx

  const [error, setError] = useState()
  const [processing, setProcessing] = useState(false)
  const [app, setApp] = useState(initialApp)

  const moveNext = () => {
    setError(null)
    if (!stepCompleted) {
      setProcessing(true)
      const updatedApp = { objid: app.objid, step: page.step }
      appService.invoke('update', updatedApp, (err, app) => {
        if (err) {
          setError(err)
        } else {
          dispatch({ type: ACTIONS.SET_APP, app: { ...app, ...updatedApp } })
          moveNextStep()
        }
        setProcessing(false)
      })
    } else {
      moveNextStep()
    }
  }

  return (
    <Card>
      <Error msg={error} />
      <FormPanel context={app} handler={setApp}>
        <Title>{title}</Title>
        <Subtitle2>Tracking No. {app.appno}</Subtitle2>
        <Subtitle>General Information</Subtitle>
        <Spacer />
        <Text
          expr={(app) => app.apptype.toUpperCase()}
          caption='Application Type'
          readOnly={true}
        />
        <Text name='contact.name' caption='Applicant' readOnly={true} />
        <Text name='contact.address' caption='Address' readOnly={true} />
        <Text
          expr={(app) => app.emptype.toUpperCase()}
          caption='Employment Type'
          readOnly={true}
        />
        <Spacer />
        <h4>Employer Information</h4>
        <Text
          name='bin'
          caption='Business Identification Number (BIN)'
          readOnly={true}
        />
        <Text
          name='business.businessname'
          caption='Employer Name'
          readOnly={true}
        />
        <Text name='business.addresstext' caption='Address' readOnly={true} />
        <ActionBar>
          <BackLink caption='Cancel' action={() => history.goBack()} />
          <Button caption='Next' action={moveNext} processing={processing} />
        </ActionBar>
      </FormPanel>
    </Card>
  )
}

export default GeneralInfoPage
