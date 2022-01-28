import React, { useState } from 'react'
import {
  Panel,
  Service,
  Stepper,
  Content,
  Page,
  StateProvider,
  Spacer
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'

import reducer, { initialState } from './reducer'

import SelectTxnTypePage from './SelectTxnTypePage.js'
import InitialPage from './InitialPage'
import GeneralInfoPage from './GeneralInfoPage'
import BillingPage from './BillingPage'
import PersonalInfoPage from './PersonalInfoPage'
import LabSchedulePage from './LabSchedulePage'
import ConfirmPage from './ConfirmPage'

const pages = [
  {
    step: 0,
    name: 'select',
    caption: 'Select Application Type',
    component: SelectTxnTypePage
  },
  { step: 1, name: 'initial', caption: 'Initial', component: InitialPage },
  {
    step: 2,
    name: 'general',
    caption: 'General Information',
    component: GeneralInfoPage
  },
  {
    step: 3,
    name: 'billing',
    caption: 'Billing Information',
    component: BillingPage
  },
  {
    step: 4,
    name: 'personal',
    caption: 'Personal Information',
    component: PersonalInfoPage
  },
  {
    step: 5,
    name: 'labschedule',
    caption: 'Laboratory Schedule',
    component: LabSchedulePage
  },
  {
    step: 6,
    name: 'confirm',
    caption: 'Confirmation',
    component: ConfirmPage
  }
]

const CertificationWebController = ({
  partner,
  service,
  location,
  history,
  // TODO:
  initialStep = 0
  // initialStep = 3
}) => {
  const [step, setStep] = useState(initialStep)
  const [app, setApp] = useState({ step: 0 })

  const moveNextStep = (nextStep) => {
    if (typeof nextStep === 'number') {
      setStep(nextStep >= 6 ? 6 : nextStep)
    } else {
      nextStep = step + 1
      setStep((cs) => cs + 1)
    }
    setApp({ ...app, step: nextStep })
  }

  const movePrevStep = () => {
    if (step === 0) {
      history.goBack()
    } else {
      setStep((cs) => cs - 1)
    }
  }

  const handleStep = (step) => {
    const actualStep = step + 2
    setStep(actualStep)
  }

  const page = pages[step]
  const PageComponent = page.component

  const compProps = {
    partner,
    service,
    location,
    history,
    moveNextStep,
    movePrevStep,
    appService: Service.lookup('CloudHealthCertificationService', 'health'),
    stepCompleted: step < app.step,
    title: 'Online Health Certificate',
    page
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Page>
        {step > 1 && step < 6 && (
          <Panel target='left' style={styles.stepperContainer}>
            <Stepper
              steps={pages.filter((pg) => pg.step > 1)}
              completedStep={app.step - 1}
              activeStep={step - 2}
              handleStep={handleStep}
            />
          </Panel>
        )}
        <Content center>
          <Panel>
            <PageComponent page={page} {...compProps} />
          </Panel>
        </Content>
        <Spacer height={40} />
      </Page>
    </StateProvider>
  )
}

const styles = {
  stepperContainer: {
    paddingTop: 30,
    paddingLeft: 40
  }
}

export default CertificationWebController
