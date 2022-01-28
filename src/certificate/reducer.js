export const ACTIONS = {
  SET_CONTACT: 'SET_CONTACT',
  SET_APP: 'SET_APP',
  SET_BILL: 'SET_BILL',
  SET_LAB_SCHEDULES: 'SET_LAB_SCHEDULES'
}

export const initialState = {
  contact: {
    name: 'JUAN',
    address: 'CEBU',
    email: 'jzamss@gmail.com',
    mobileno: '0999-121811'
  },
  app: { apptye: 'new', emptype: 'new' },
  bill: {},
  labschedules: [],
  origin: 'filipizen',
  txntype: 'health',
  txntypename: 'Health Certificate Fee',
  refno: ''
}

const reducer = (draft, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONTACT:
      draft.contact = action.contact
      return

    case ACTIONS.SET_APP:
      draft.app = action.app
      return

    case ACTIONS.SET_BILL:
      draft.bill = action.bill
      return

    case ACTIONS.SET_LAB_SCHEDULES:
      draft.labschedules = action.labschedules
      return

    default:
      return draft
  }
}

export default reducer
