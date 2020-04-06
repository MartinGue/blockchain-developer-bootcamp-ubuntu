import { get } from 'lodash'
import { createSelector } from  'reselect'
import moment from 'moment'
import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers'

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)


const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

export const contractsLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl,el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
	filledOrders,
	(orders) => {
		// sort orders by date ascending for price comparison
		orders = orders.sort((a,b)=> a.timestamp - b.timestamp)
		// Decorate the orders
		orders = decorateFilledOrders(orders)

		// sort orders by date descending for display
		orders = orders.sort((a,b)=> b.timestamp - a.timestamp)
		return orders
	}
)

const decorateFilledOrders = (orders) => {
	//initialize the first order as previous order
	let previousOrder = orders[0]
	return(
		orders.map((order) => {
		  order = decorateOrder(order)
		  order = decorateFilledOrder(order, previousOrder)
		  previousOrder = order //Update the the previous order once its decorated
		  return order
		})
	)
}

const decorateOrder = (order) => {
	let etherAmount
	let tokenAmount	
	// if tokenGive is address0 we know its ether then we read the amount from the state 
	if(order.tokenGive == ETHER_ADDRESS) {
		etherAmount = order.amountGive
		tokenAmount = order.amountGet
	} else {
		etherAmount = order.amountGet
		tokenAmount = order.amountGive
	}
// calculate tokenprice to 5 decimals
	const precision = 1000000

	let tokenPrice = (etherAmount / tokenAmount)
		tokenPrice = Math.round(tokenPrice * precision) /precision

	return({
		...order,
		etherAmount : ether(etherAmount),
		tokenAmount : tokens(tokenAmount),
		tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format('LLLL')
	})
}

const decorateFilledOrder = (order, previousOrder) => {
	return({
		...order,
		tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
	})
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
	// Show green price if only one order exists
	if(previousOrder.id === orderId) {
		return GREEN
	}
	//show green price if orderprice is higher then previous order
	// show red price if order lower thern previous order
	if(previousOrder.tokenPrice <= tokenPrice) {
		return GREEN //success	
	} else {
		return RED //danger
	}
}