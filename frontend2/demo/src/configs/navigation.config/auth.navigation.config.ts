import { AUTH_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER, USER1 } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const authNavigationConfig: NavigationTree[] = [
    {
        key: 'authentication',
        path: '',
        title: 'Authentication',
        translateKey: 'nav.authentication.authentication',
        icon: 'authentication',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER, USER1],
        meta: {
            horizontalMenu: {
                layout: 'default',
            },
        },
        subMenu: [
            {
                key: 'authentication.signIn',
                path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
                title: 'Sign In',
                translateKey: 'nav.authentication.signIn',
                icon: 'signIn',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [
                 
                ],
            },
            {
                key: 'authentication.signUp',
                path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
                title: 'Sign Up',
                translateKey: 'nav.authentication.signUp',
                icon: 'signUp',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'authentication.signUpSimple',
                        path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
                        title: 'Simple',
                        translateKey: 'nav.authentication.signUpSimple',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                 
                ],
            },
           
        ],
    },
]

export default authNavigationConfig
