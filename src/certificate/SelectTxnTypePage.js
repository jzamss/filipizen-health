import React, { useState } from 'react'
import {
  Button,
  Radio,
  ActionBar,
  BackLink,
  Item,
  Spacer,
  Text,
  Subtitle,
  Card,
  Title,
  useData
} from 'rsi-react-web-components'
import { ACTIONS } from './reducer'

const SelectTxnTypePage = ({ title, service, history, appService, moveNextStep }) => {
  const [error, setError] = useState()
  const [appType, setAppType] = useState('new')
  const [appno, setAppno] = useState()
  const [processing, setProcessing] = useState(false)

  const [ctx, dispatch] = useData()

  const submitAppType = () => {
    if (appType === 'new') {
      moveNextStep()
    } else {
      if (!appno) {
        setError('Tracking No. is required.')
      } else {
        setProcessing(true)
        appService.invoke('getApplicationData', { appno }, (err, data) => {
          if (!err) {
            const app = data.app
            dispatch({ type: ACTIONS.SET_APP, app })
            dispatch({ type: ACTIONS.SET_BILL, bill: data.bill })
            dispatch({ type: ACTIONS.SET_LAB_SCHEDULES, labschedules: data.labschedules })
            moveNextStep(app.step + 1)
          } else {
            setError(err)
          }
          setProcessing(false)
        })
      }
    }
  }

  return (
    <Card>
      <Title style={{ minWidth: '300px' }}>{title}</Title>
      <Subtitle>Select Application Type</Subtitle>
      <Spacer height={30} />
      <Radio value={appType} onChange={setAppType}>
        <Item caption='New Application' value='new' />
        <Item caption='Resume Application' value='resume' />
      </Radio>
      <Text
        caption='Application Tracking No.'
        value={appno}
        onChange={setAppno}
        visibleWhen={appType === 'resume'}
        variant='outlined'
        fullWidth={false}
        required
        style={{ marginLeft: 40 }}
        error={error}
        helperText={error}
        size='small'
        autoFocus={true}
      />
      <ActionBar>
        <BackLink caption='Cancel' action={() => history.goBack()} />
        <Button
          caption='Next'
          action={submitAppType}
          disabled={processing}
          processing={processing}
        />
      </ActionBar>
    </Card>
  )
}

export default SelectTxnTypePage
