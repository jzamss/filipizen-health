import React, { useState } from 'react'
import {
  Card,
  FormPanel,
  Panel,
  Button,
  Error,
  ActionBar,
  BackLink,
  Spacer,
  Title,
  Text,
  Subtitle,
  useData,
  Radio,
  Item,
  Service
} from 'rsi-react-web-components'

import { ACTIONS } from './reducer'

import { ContactVerification } from 'rsi-react-filipizen-components'
import Confirmation from '../components/Confirmation'
import TrackingInfo from '../components/TrackingInfo'

const steps = [
  { name: 'contact', caption: 'Contact Information' },
  { name: 'apptype', caption: 'Application Type' },
  { name: 'employment', caption: 'Employment Information' },
  { name: 'confirmation', caption: 'Confirmation' },
  { name: 'newapp', caption: 'New Application ' }
]

const InitialPage = ({ partner, history, title, appService, moveNextStep: exitInitial }) => {
  const [ctx, dispatch] = useData()
  const { contact, bill } = ctx

  const [error, setError] = useState()
  const [processing, setProcessing] = useState(false)

  const [app, setApp] = useState({
    orgcode: partner.id,
    apptype: 'new',
    emptype: 'new',
    contact
  })

  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]

  const moveNextStep = () => {
    setError(null)
    setCurrentStep((cs) => cs + 1)
  }

  const movePrevStep = () => {
    setError(null)
    setCurrentStep((cs) => cs - 1)
  }

  const validateEmploymentInfo = () => {
    setProcessing(true)
    const svc = Service.lookup(`${partner.id}:OnlineHealthCertificationService`, 'health')
    svc.invoke('validateBusinessAndGetBill', app, (err, data) => {
      setProcessing(false)
      if (err) {
        setError(err)
      } else {
        const updatedApp = { ...app, business: data.business }
        setApp(updatedApp)
        dispatch({ type: ACTIONS.SET_APP, app: updatedApp })
        dispatch({ type: ACTIONS.SET_BILL, bill: data.bill })
        moveNextStep()
      }
    })
  }

  const saveApp = () => {
    appService.invoke('create', { ...app, bill, partner }, (err, app) => {
      if (!err) {
        dispatch({ type: ACTIONS.SET_APP, app })
        setApp(app)
        moveNextStep()
      } else {
        setError(err)
      }
    })
  }

  return (
    <React.Fragment>
      {step.name === 'contact' ? (
        <ContactVerification
          partner={partner}
          showName={true}
          moveNextStep={moveNextStep}
          movePrevStep={movePrevStep}
          title={title}
          subtitle='Contact Verification'
          emailRequired={true}
        />
      ) : (
        <Card>
          <FormPanel
            context={app}
            handler={setApp}
            visibleWhen={step.name === 'apptype'}
            style={{ minWidth: '400px' }}
          >
            <Title>{title}</Title>
            <Subtitle>{step.caption}</Subtitle>
            <Spacer />
            <Radio name='apptype'>
              <Item caption='New' value='new' />
              <Item caption='Renewal' value='renewal' />
            </Radio>
            <ActionBar>
              <BackLink caption='Cancel' action={() => history.goBack()} />
              <Button caption='Next' action={moveNextStep} />
            </ActionBar>
          </FormPanel>

          <FormPanel
            visibleWhen={step.name === 'employment'}
            context={app}
            handler={setApp}
            style={{ minWidth: '400px' }}
          >
            <Title>{title}</Title>
            <Subtitle>{step.caption}</Subtitle>
            <Spacer height={30} />
            <Error msg={error} />
            <Radio name='emptype'>
              <Item caption='New Employment' value='new' />
              <Item caption='Employed' value='employed' />
            </Radio>
            <Spacer />
            <Text
              caption='Employer Business Identification Number (BIN)'
              name='bin'
              required={true}
            />
            <ActionBar>
              <BackLink caption='Cancel' action={() => history.goBack()} />
              <Button caption='Next' action={validateEmploymentInfo} processing={processing} />
            </ActionBar>
          </FormPanel>

          <Panel visibleWhen={step.name === 'confirmation'}>
            <Title>{title}</Title>
            <Confirmation
              title={title}
              partner={partner}
              error={error}
              onCancel={movePrevStep}
              onContinue={saveApp}
            />
          </Panel>

          <Panel visibleWhen={step.name === 'newapp'} width={400}>
            <Title>{title}</Title>
            <TrackingInfo appno={app.appno} onContinue={exitInitial} />
          </Panel>
        </Card>
      )}
    </React.Fragment>
  )
}

export default InitialPage
