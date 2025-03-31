import { DASHBOARDS_PREFIX_PATH } from '@/constants/route.constant'
import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'

import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const dashboardsNavigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '',
        title: 'Dashboard',
        translateKey: 'nav.dashboard.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN],
        meta: {
            horizontalMenu: {
                layout: 'default',
            },
        },
        subMenu: [
            {
                key: 'dashboard.ecommerce',
                path: `${DASHBOARDS_PREFIX_PATH}/ecommerce`,
                title: 'Ecommerce',
                translateKey: 'nav.dashboard.ecommerce',
                icon: 'dashboardAnalytic',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
       

            {
                key: 'dashboard.tunemodel',
                path: '',
                title: 'Tuning',
                translateKey: 'nav.dashboard.tunemodel',
                icon: 'Robot',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.fileManager',
                        path: `${CONCEPTS_PREFIX_PATH}/file-manager`,
                        title: 'File Manager',
                        translateKey: 'nav.fileManager',
                        icon: 'fileManager',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.fileManagerDesc',
                                label: 'Manage your files',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
         
        ],
    },
]

export default dashboardsNavigationConfig
