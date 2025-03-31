import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'


import {
    PiUserDuotone,
    PiGearDuotone,
    PiPulseDuotone,
    PiSignOutDuotone,
} from 'react-icons/pi'
import { useAuth } from '@/auth'
import type { JSX } from 'react'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}




const _UserDropdown = () => {
    const { avatar, userName, email } = useSessionUser((state) => state.user)
    const [imgUrl, setImgUrl] = useState('')
    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }
    useEffect(() => {
        const getImgURL = async () => {
            try {
                var cleanEmail = ''
                if (email) {
                    cleanEmail = email.replace(".com", "");
                }

                const token = localStorage.getItem("token")
                const responseImg = await axios.get(`${API_BASE_URL}/image/images/${cleanEmail}`, {
                    headers: {
                        Authorization: `Beaturer ${token}`,
                    },
                    responseType: "blob", // Quan trọng để lấy dữ liệu ảnh
                });
                // console.log(responseImg)
                const imageUrl = URL.createObjectURL(responseImg.data);
                console.log(imageUrl)
                localStorage.setItem("imgURL", imageUrl)
                setImgUrl(imageUrl)
                console.log(imgUrl)
            } catch (err) {
                localStorage.setItem("imgURL", '/img/avatars/thumb-1.jpg')

                console.error(err)
            }
        }
        getImgURL()
    }, [])




    const avatarProps = {
        src: imgUrl || '/img/avatars/thumb-1.jpg',
    };



    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>

                        <div className="text-xs">
                            {email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>

            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Đăng xuất</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
