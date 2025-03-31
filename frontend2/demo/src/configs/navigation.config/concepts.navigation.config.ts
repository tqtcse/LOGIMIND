import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER, USER1 } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const conceptsNavigationConfig: NavigationTree[] = [
    {
        key: 'concepts',
        path: '',
        title: 'Concepts',
        translateKey: 'nav.concepts',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER, USER1],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [
            {
                key: 'concepts.ai',
                path: '',
                title: 'AI',
                translateKey: 'nav.conceptsAi.ai',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER, USER1],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAi.aiDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.ai.chat',
                        path: `${CONCEPTS_PREFIX_PATH}/ai/chat`,
                        title: 'Chat',
                        translateKey: 'nav.conceptsAi.chat',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER1, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.conceptsAi.chatDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },

                ],
            },

            {
                key: 'concepts.customers',
                path: '',
                title: 'Customers',
                translateKey: 'nav.conceptsCustomers.customers',
                icon: 'customers',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsCustomers.customersDesc',
                        label: 'Customer management',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.customers.customerList',
                        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-list`,
                        title: 'Customer List',
                        translateKey: 'nav.conceptsCustomers.customerList',
                        icon: 'customerList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.customerListDesc',
                                label: 'List of all customers',
                            },
                        },
                        subMenu: [],
                    },
                  

                ],
            },

            {
                key: 'concepts.orders',
                path: '',
                title: 'Orders',
                translateKey: 'nav.conceptsOrders.orders',
                icon: 'orders',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER, USER1],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsOrders.ordersDesc',
                        label: 'Customer orders management',
                    },
                },
                subMenu: [

                    {
                        key: 'concepts.orders.orderCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/orders/order-create`,
                        title: 'Order Create',
                        translateKey: 'nav.conceptsOrders.orderCreate',
                        icon: 'orderCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN,],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsOrders.orderCreateDesc',
                                label: 'Create new order',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.account.pricing',
                        path: `${CONCEPTS_PREFIX_PATH}/account/pricing`,
                        title: 'Gói',
                        translateKey: 'nav.conceptsAccount.pricing',
                        icon: 'accountPricing',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER, USER1],
                        meta: {
                            description: {
                                translateKey: 'nav.conceptsAccount.pricingDesc',
                                label: 'View pricing plans',
                            },
                        },
                        subMenu: [],
                    },

                ],
            },
            {
                key: 'concepts.account',
                path: '',
                title: 'Tài Khoản',
                translateKey: 'nav.conceptsAccount.account',
                icon: 'account',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER, USER1],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAccount.accountDesc',
                        label: 'Account settings and info',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.account.settings',
                        path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
                        title: 'Cài Đặt',
                        translateKey: 'nav.conceptsAccount.settings',
                        icon: 'accountSettings',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER, USER1],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsAccount.settingsDesc',
                                label: 'Configure your settings',
                            },
                        },
                        subMenu: [],
                    },


                ],
            },
           
        ],
    },
]

export default conceptsNavigationConfig
