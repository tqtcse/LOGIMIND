import { lazy } from 'react'
import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const conceptsRoute: Routes = [
    {
        key: 'concepts.ai.chat',
        path: `${CONCEPTS_PREFIX_PATH}/ai/chat`,
        component: lazy(() => import('@/views/concepts/ai/Chat')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.customers.customerList',
        path: `${CONCEPTS_PREFIX_PATH}/customers/customer-list`,
        component: lazy(
            () => import('@/views/concepts/customers/CustomerList'),
        ),
        authority: [ADMIN, USER],
    },
   


    {
        key: 'concepts.orders.orderCreate',
        path: `${CONCEPTS_PREFIX_PATH}/orders/order-create`,
        component: lazy(() => import('@/views/concepts/orders/OrderCreate')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Chỉnh Sửa Gói',
                contained: true,
                description:
                    'Create new customer orders quickly and accurately',
            },
            footer: false,
        },
    },
    
    {
        key: 'concepts.account.settings',
        path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
        component: lazy(() => import('@/views/concepts/accounts/Settings')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Cài đặt',
            },
            pageContainerType: 'contained',
        },
    },


    {
        key: 'concepts.account.pricing',
        path: `${CONCEPTS_PREFIX_PATH}/account/pricing`,
        component: lazy(() => import('@/views/concepts/accounts/Pricing')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
   

    {
        key: 'concepts.fileManager',
        path: `${CONCEPTS_PREFIX_PATH}/file-manager`,
        component: lazy(() => import('@/views/concepts/files/FileManager')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
  
    
]

export default conceptsRoute
