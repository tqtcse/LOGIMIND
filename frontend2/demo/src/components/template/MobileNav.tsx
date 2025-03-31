import { useState, Suspense, lazy, useEffect } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import NavToggle from '@/components/shared/NavToggle'
import { DIR_RTL } from '@/constants/theme.constant'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { useThemeStore } from '@/store/themeStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import axios from 'axios'
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerticalMenuContent = lazy(
    () => import('@/components/template/VerticalMenuContent'),
)
interface OrderDetail {
    id: string;
    id_account: string;
    id_package: string;
    expired_datetime: string;
    updated_datetime: string;
    created_datetime: string;
}

type MobileNavToggleProps = {
    toggled?: boolean
}

type MobileNavProps = {
    translationSetup?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const MobileNav = ({
    translationSetup = appConfig.activeNavTranslation,
}: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    const handleDrawerClose = () => {
        setIsOpen(false)
    }

    const direction = useThemeStore((state) => state.direction)
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
        <>
            <div className="text-2xl" onClick={handleOpenDrawer}>
                <MobileNavToggle toggled={isOpen} />
            </div>
            <Drawer
                title="Navigation"
                isOpen={isOpen}
                bodyClass={classNames('p-0')}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <Suspense fallback={<></>}>
                    {isOpen && (
                        <VerticalMenuContent
                            collapsed={false}
                            navigationTree={navigationConfig}
                            routeKey={currentRouteKey}
                            userAuthority={userAuthority || []}
                            direction={direction}
                            translationSetup={translationSetup}
                            onMenuItemClick={handleDrawerClose}
                        />
                    )}
                </Suspense>
            </Drawer>
        </>
    )
}

export default MobileNav
