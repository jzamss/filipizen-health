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
  useData,
  Spacer,
  Date as DateUI,
  BackLink,
  Combobox,
  isDateBefore
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'
import { ACTIONS } from './reducer'

const LabSchedulePage = ({ moveNextStep, movePrevStep, page, appService, title }) => {
  const [ctx, dispatch] = useData()
  const { app, labschedules } = ctx

  const [error, setError] = useState()
  const [processing, setProcessing] = useState(false)
  const [labschedule, setLabschedule] = useState({ ...app.labschedule })
  const [errors, setErrors] = useState({})

  const valid = () => {
    setError('')
    setErrors({})

    const errors = {}
    if (!labschedule.dtschedule) {
      errors.dtschedule = 'Date of examination is required'
    } else if (isDateBefore(Date.parse(labschedule.dtschedule), Date.now())) {
      errors.dtschedule = 'Date must be after current date'
    }
    if (!labschedule.schedule) {
      errors.schedule = 'Schedule is required'
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return false
    }
    return true
  }

  const submitLabSchedule = () => {
    if (!valid()) return

    setProcessing(true)
    appService.invoke(
      'saveLabSchedule',
      { appid: app.objid, step: page.step, labschedule },
      (err, labschedule) => {
        if (err) {
          setError(err)
        } else {
          dispatch({ type: ACTIONS.SET_APP, app: { ...app, labschedule } })
          moveNextStep()
        }
        setProcessing(false)
      }
    )
  }

  return (
    <Card>
      <FormPanel context={labschedule} handler={setLabschedule}>
        <Title>{title}</Title>
        <Subtitle2>Tracking No. {app.appno}</Subtitle2>
        <Subtitle>Laboratory Schedule</Subtitle>
        <Spacer />
        {error && (
          <React.Fragment>
            <Error msg={error} />
            <Spacer />
          </React.Fragment>
        )}
        <label>Please choose a laboratory schedule</label>
        <DateUI
          name='dtschedule'
          caption='Examination Date'
          required={true}
          autoFocus={true}
          error={errors.dtschedule}
          helperText={errors.dtschedule}
        />
        <Combobox
          items={labschedules}
          name='schedule'
          caption='Batch Schedule'
          expr={(item) =>
            `${item.batchno}   ${item.schedule} (${item.openingtime} - ${item.closingtime})`
          }
          required={true}
          helperText={errors.schedule}
        />

        <ActionBar>
          <BackLink caption='Back' action={movePrevStep} />
          <Button
            caption='Next'
            action={submitLabSchedule}
            disableWhen={processing}
            processing={processing}
          />
        </ActionBar>
      </FormPanel>
      <pre>{JSON.stringify(labschedules, null, 2)}</pre>
    </Card>
  )
}

export default LabSchedulePage
