import React, { useState } from 'react'
import {
  Card,
  FormPanel,
  Error,
  Panel,
  Button,
  ActionBar,
  Title,
  Subtitle,
  Subtitle2,
  Spacer,
  useData,
  BackLink,
  Table,
  TableColumn,
  Label,
  currencyFormat
} from 'rsi-react-web-components'
import 'rsi-react-web-components/dist/index.css'

import PaymentPage from './PaymentPage'
import { ACTIONS } from './reducer'

const BillingPage = ({ moveNextStep, movePrevStep, page, appService, partner, title }) => {
  const [ctx, dispatch] = useData()
  const { app, bill, contact } = ctx

  const [error, setError] = useState()
  const [mode, setMode] = useState('bill')
  const [processing, setProcessing] = useState(false)

  const moveNext = () => {
    setError('')
    setProcessing(true)
    appService.invoke('update', { objid: app.objid, step: page.step }, (err, app) => {
      if (err) {
        setError(err)
      } else {
        dispatch({ type: ACTIONS.SET_APP, app: { ...app, step: page.step } })
        moveNextStep()
      }
      setProcessing(false)
    })
  }

  if (mode === 'payment') {
    const props = {
      title,
      partner,
      contact,
      app
    }
    return <PaymentPage {...props} />
  }

  return (
    <Card>
      <FormPanel context={app} handler={() => {}}>
        <Title style={{ minWidth: '350px' }}>{title}</Title>
        <Subtitle2>Tracking No. {app.appno}</Subtitle2>
        <Subtitle>{page.caption}</Subtitle>
        <Spacer />
        <Error msg={error} />
        <Table items={bill ? bill.items : []} size='small' showPagination={false}>
          <TableColumn caption='Particulars' expr='item.title' />
          <TableColumn caption='Amount' expr='amount' align='right' format='currency' />
        </Table>
        <Panel
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 15
          }}
        >
          <Label
            context={bill}
            caption='TOTAL AMOUNT:'
            expr={(item) => currencyFormat(item.amount)}
          />
        </Panel>
        {app.payment && app.payment.receiptno && (
          <Panel>
            <h4>Details of Payment</h4>
            <Label caption='Receipt No.'>{app.payment.receiptno}</Label>
            <Label caption='Receipt Date'>{app.payment.receiptdate}</Label>
            <Label caption='Receipt Amount'>P{currencyFormat(app.payment.amount)}</Label>
            <Label caption='Paid thru'>{app.payment.paypartnerid}</Label>
          </Panel>
        )}
        <ActionBar>
          <BackLink caption='Back' action={movePrevStep} />
          {app.payment && app.payment.receiptno ? (
            <Button caption='Next' action={moveNext} />
          ) : (
            <Button caption='Proceed to Payment' action={() => setMode('payment')} />
          )}
        </ActionBar>
      </FormPanel>
    </Card>
  )
}

export default BillingPage
