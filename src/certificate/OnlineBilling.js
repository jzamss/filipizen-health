import React, { useState } from 'react'
import {
  Card,
  Panel,
  Button,
  FormPanel,
  ActionBar,
  Spacer,
  Error,
  Subtitle,
  Title,
  BackLink,
  useData,
  Table,
  TableColumn,
  Label,
  currencyFormat
} from 'rsi-react-web-components'

const OnlineBilling = ({ title, partner, onCancel, onSubmit, error: paymentError }) => {
  const [ctx, dispatch] = useData()
  const { origin, txntype, txntypename, app, bill } = ctx
  const [error, setError] = useState(paymentError)

  const checkoutPayment = () => {
    onSubmit({
      origin,
      refno: app.appno,
      txntype,
      txntypename,
      orgcode: partner.id,
      paidby: bill.paidby,
      paidbyaddress: bill.paidbyaddress,
      amount: bill.amount,
      particulars: 'Health Certificate Fee',
      items: bill.items,
      info: { data: app }
    })
  }

  const onCancelBilling = () => {
    onCancel(0)
  }

  return (
    <Card style={{ maxWidth: 500 }}>
      <FormPanel context={app} handler={() => {}}>
        <Title>{title}</Title>
        <Subtitle>Billing Information</Subtitle>
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
      </FormPanel>
      <ActionBar>
        <BackLink caption='Back' action={onCancelBilling} />
        <Button
          caption='Confirm Payment'
          action={checkoutPayment}
          disableWhen={bill.amount === 0}
        />
      </ActionBar>
    </Card>
  )
}

export default OnlineBilling
