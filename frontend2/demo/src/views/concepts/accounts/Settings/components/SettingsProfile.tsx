import { useMemo, useEffect, useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { components } from 'react-select'
import { apiDeleteAvatar } from '@/services/AccontsService'
import { apiGetSettingsProfile } from '@/services/AccontsService'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { GetSettingsProfileResponse } from '../types'
import axios from 'axios'
import CryptoJS from "crypto-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Upload from '@/components/ui/Upload'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import useSWRMutation from 'swr/mutation'



const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProfileSchema = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    img: string
    country: string
    address: string
    postcode: string
    city: string
}



const validationSchema: ZodType<ProfileSchema> = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Please input your mobile number' }),
    country: z.string().min(1, { message: 'Please select a country' }),
    address: z.string().min(1, { message: 'Addrress required' }),
    postcode: z.string().min(1, { message: 'Postcode required' }),
    city: z.string().min(1, { message: 'City required' }),
    img: z.string(),
})




const SettingsProfile = () => {
    const { trigger, data, isMutating } = useSWRMutation(
        '/api/delete/avatar',
        (url, { arg }: { arg: string }) => apiDeleteAvatar<GetSettingsProfileResponse>(arg)
    );
    // const { data, mutate } = useSWR(
    //     '/api/settings/profile/',
    //     () => apiGetSettingsProfile<GetSettingsProfileResponse>(),
    //     {
    //         revalidateOnFocus: false,
    //         revalidateIfStale: false,
    //         revalidateOnReconnect: false,
    //     },
    // )

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }


    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
    })

    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imgUrlRef = useRef<string | null>(null);
    const [userData, setUserData] = useState({
        fullname: "",
        address: "",
        company: "",
        username: "",
        email: ""
    });


    const handleSave = async () => {
        try {
            const fullname = document.querySelector("#fullname")?.getAttribute("value");
            const address = document.querySelector("#address")?.getAttribute("value");
            const company = document.querySelector("#company")?.getAttribute("value");
            const username = document.querySelector("#username")?.getAttribute("value");
            const email = document.querySelector("#email")?.getAttribute("value");
            const token = localStorage.getItem("token")



            const response = await axios.post(
                `${API_BASE_URL}/user/update-user-infor`,
                { email, name: fullname, username, address, company },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {

                toast.success("Lưu thành công!", { autoClose: 1000 });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }


        } catch (error: any) {
            console.log(error)

        }
    }



    useEffect(() => {

        const fetchData = async () => {
            // if (imageUrl) return;
            try {

                const token = localStorage.getItem("token")
                var email = localStorage.getItem("email")
                var cleanEmail = ''
                if (email) {
                    email = CryptoJS.AES.decrypt(email, secretKey).toString(CryptoJS.enc.Utf8);
                    setUserEmail(email)
                    if (userEmail) {
                        cleanEmail = userEmail.replace(".com", "");
                    }

                }
                const filename = cleanEmail



                const response = await axios.post(
                    `${API_BASE_URL}/user/get-user-infor`,
                    { email },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // console.log(response.data)

                const address = response.data.address;
                const company = response.data.company;
                const fullname = response.data.fullname;
                const username = response.data.username;



                setUserData({
                    fullname: response.data.fullname || "",
                    address: response.data.address || "",
                    company: response.data.company || "",
                    username: response.data.username || "",
                    email: response.data.email || ""
                });

                const responseImg = await axios.get(`${API_BASE_URL}/image/images/${filename}`, {
                    headers: {
                        Authorization: `Beaturer ${token}`,
                    },
                    responseType: "blob",
                });

                const imageUrl = URL.createObjectURL(responseImg.data);
                setImageUrl(imageUrl)

            } catch (err) {
                console.log(err)
            }
        };

        fetchData();

    }, [userEmail])

    const onSubmit = async (values: ProfileSchema) => {
        await sleep(500)
        if (data) {
            // mutate({ ...data, ...values }, false)
        }
    }

    const handleUpload = async (file: File, field: any) => {
        try {

            var cleanEmail = ''
            if (userEmail) {
                cleanEmail = userEmail.replace(".com", "");
            }
            const newFile = new File([file], `${cleanEmail}.${file.name.split('.').pop()}`, { type: file.type });
            const formData = new FormData();
            formData.append("file", newFile);

            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_BASE_URL}/image/imgUpload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                const imageUrl = response.data.url;
                field.onChange(imageUrl);
                toast.success("Lưu thành công!", { autoClose: 1000 });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Tải ảnh thất bại!");

        }


    };
    const handleDelete = async () => {
        try {

            const token = localStorage.getItem("token")
            var cleanEmail = ''
            if (userEmail) {
                cleanEmail = userEmail.replace(".com", "");
                const response22 = await trigger(cleanEmail)
                // console.log('Delete success:', response22)
                if (response22) {
                    toast.success("Xóa thành công!", { autoClose: 1000 });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }

        } catch (err) {
            console.log(err)
            console.error("Lỗi khi xoá ảnh :", err);
        }
    }

    return (
        <>
            <ToastContainer />
            <h4 className="mb-6">Thông tin cá nhân</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-8">
                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => (
                            <div id="Avatar" className="flex items-center gap-4">
                                <Avatar
                                    id="avatar"
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={imageUrl || field.value}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                handleUpload(files[0], field);
                                                field.onChange(
                                                    URL.createObjectURL(
                                                        files[0],

                                                    ),
                                                )
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                        >
                                            Tải ảnh
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Xóa ảnh
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="Họ và tên"
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Họ và tên"
                                    id="fullname"
                                    value={userData.fullname}
                                    onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
                                // {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tên người dùng"
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Tên người dùng"
                                    id="username"
                                    value={userData.username}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder="Email"
                                id="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                disabled
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-end gap-4 w-full mb-6">

                </div>
                <h4 className="mb-6">Thông tin địa chỉ</h4>

                <FormItem
                    label="Nơi ở"
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nơi ở hiện tại"
                                id="address"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Công ty"
                    invalid={Boolean(errors.city)}
                    errorMessage={errors.city?.message}
                >
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Công ty"
                                id="company"
                                value={userData.company}
                                onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                            />
                        )}
                    />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                </div>
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="button"
                        loading={isSubmitting}
                        onClick={handleSave}
                    >
                        Lưu
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsProfile
