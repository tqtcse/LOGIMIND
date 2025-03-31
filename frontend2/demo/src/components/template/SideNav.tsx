import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
// import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import { useEffect, useState } from 'react'
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface OrderDetail {
    id: string;
    id_account: string;
    id_package: string;
    expired_datetime: string;
    updated_datetime: string;
    created_datetime: string;
}

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}: SideNavProps) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const [userAuthority, setUserAuthority] = useState(["user"]);
    useEffect(() => {
        const getUserId = async () => {
            const token = localStorage.getItem("token")
            const encryptedEmail = localStorage.getItem("email");

            var email = ''
            if (encryptedEmail) {
                email = CryptoJS.AES.decrypt(encryptedEmail, secretKey).toString(CryptoJS.enc.Utf8);
                // console.log(email);
            }

            const response2 = await axios.post(`${API_BASE_URL}/user/get-user-id?`, { email },

                {
                    headers: { Authorization: `Bearer ${token}` },
                },

            )
            //CryptoJS.AES.encrypt(response2.data.id, secretKey).toString()
            localStorage.setItem("userid", CryptoJS.AES.encrypt(response2.data.id, secretKey).toString())
            const response3 = await axios.get(`${API_BASE_URL}/order/get-orderDetail`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )

            const userId = response2.data.id;
            const orderDetails: OrderDetail[] = response3.data;

            const userOrder = orderDetails.find(order => order.id_account === userId);

            const userOrders2 = orderDetails.filter(order => order.id_account === userId);


            if (userOrders2.length > 0) {

                const latestOrder = userOrders2.reduce((latest, order) =>
                    new Date(order.expired_datetime) > new Date(latest.expired_datetime) ? order : latest
                );


                if (new Date(latestOrder.expired_datetime) > new Date()) {
                    const encryptedRole = localStorage.getItem("role");

                    if (encryptedRole) {
                        // console.log(CryptoJS.AES.decrypt(encryptedRole, secretKey).toString(CryptoJS.enc.Utf8))
                        if (CryptoJS.AES.decrypt(encryptedRole, secretKey).toString(CryptoJS.enc.Utf8) === 'admin') {
                            // console.log("ff")
                            setUserAuthority(["admin"]);
                            // console.log(userAuthority)
                        } else {
                            setUserAuthority(["users"]);
                            localStorage.setItem("role", CryptoJS.AES.encrypt("users", secretKey).toString())
                        }
                    }


                    // console.log()

                } else {
                    console.log("❌ Gói này đã hết hạn.");
                }
            } else {
                console.log("❌ Không tìm thấy order nào cho user này.");
            }


            if (encryptedEmail) {
                const email = CryptoJS.AES.decrypt(encryptedEmail, secretKey).toString(CryptoJS.enc.Utf8);
                // console.log(email);
            }
            const encryptedRole = localStorage.getItem("role");

            if (encryptedRole) {
                // console.log(CryptoJS.AES.decrypt(encryptedRole, secretKey).toString(CryptoJS.enc.Utf8))
                if (CryptoJS.AES.decrypt(encryptedRole, secretKey).toString(CryptoJS.enc.Utf8) === 'admin') {
                    // console.log("ff")
                    setUserAuthority(["admin"]);
                    // console.log(userAuthority)
                }
            }


        }
        getUserId()

    }, [])


    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >

            </Link>
            <div className={classNames('side-nav-content', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationConfig}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
