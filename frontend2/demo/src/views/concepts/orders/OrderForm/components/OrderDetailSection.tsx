import { useMemo, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import { useState } from "react";
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { TbSearch } from 'react-icons/tb'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



type CustomerDetailSectionProps = FormSectionBaseProps

type Package = {
    id: string;
    package_name: string;
    price: number;
    description: string;
    day: number;
    created_datetime: string;
    updated_datetime: string;
};


const CustomerDetailSection = ({
    control,
    errors,
}: CustomerDetailSectionProps) => {

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [packageList, setPackageList] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [selectedPackage2, setSelectedPackage2] = useState<Package | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);


    useEffect(() => {
        sessionStorage.removeItem("hasReloadedsPricing")
        const hasReloadedCreatePackage = sessionStorage.getItem("hasReloadedCreatePackage");
        if (!hasReloadedCreatePackage) {
            sessionStorage.setItem("hasReloadedCreatePackage", "true");
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        const fetchPackages = async () => {
            const token = localStorage.getItem("token");
            try {

                const response = await axios.get(`${API_BASE_URL}/packages/packages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setPackageList(response.data)
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchPackages();
    }, [updateTrigger]);
    const Find = (value: string) => {

        const foundPackage = packageList.find((pkg) => pkg.id === value);

        if (foundPackage) {
            setSelectedPackage(foundPackage);
            setSelectedPackage2(foundPackage);
            toast.success("Gói đã được tìm thấy!", { autoClose: 1000 });
        } else {
            setSelectedPackage(null);
            setSelectedPackage2(null);
            toast.error("Không tìm thấy gói nào cả!", { autoClose: 1000 });

        }

    }
    const handleDelete = async () => {
        try {
            const packagename = document.querySelector("#packagename")?.getAttribute("value");
            const id_package = document.querySelector("#index")?.getAttribute("value");
            const description = selectedPackage ? selectedPackage.description : "";
            const price = document.querySelector("#price")?.getAttribute("value");
            const day = document.querySelector("#day")?.getAttribute("value");
            const token = localStorage.getItem("token");


            const response = await axios.delete(`${API_BASE_URL}/packages/delete-package/${id_package}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {

                toast.success("Xóa thành công!", { autoClose: 2000 });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }


        } catch (err) {
            console.log(err)

        }

    }
    const handleCreate = async () => {
        try {
            const packagename = document.querySelector("#packagename")?.getAttribute("value");
            const id_package = document.querySelector("#index")?.getAttribute("value");
            const description = selectedPackage ? selectedPackage.description : "";
            const price = document.querySelector("#price")?.getAttribute("value");
            const day = document.querySelector("#day")?.getAttribute("value");
            const token = localStorage.getItem("token");



            if (!id_package || !packagename || !description || !price || !day) {
                console.log("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/packages/add-package`, {
                id_package,
                packagename,
                description,
                price,
                day
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                toast.success("Tạo thành công!", { autoClose: 2000 });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }


        } catch (err) {
            toast.error("Gói đã tồn tại!", { autoClose: 2000 });
            console.log(err)

        }

    }

    const handleChange = async () => {
        try {
            const packagename = document.querySelector("#packagename")?.getAttribute("value");
            const id = document.querySelector("#index")?.getAttribute("value");
            const description = selectedPackage ? selectedPackage.description : "";
            const price = document.querySelector("#price")?.getAttribute("value");
            const day = document.querySelector("#day")?.getAttribute("value");
            const token = localStorage.getItem("token");

            console.log(packagename, id, description, price, day)

            if (!id || !packagename || !description || !price || !day) {
                console.log("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            const response = await axios.put(
                `${API_BASE_URL}/packages/update-package`,
                { id, packagename, description, price, day },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Cập nhật thành công!", { autoClose: 2000 });
            setTimeout(() => {
                window.location.reload();
            }, 2000);


        } catch (err) {
            console.log(err)
            toast.error("Không tìm thấy gói!", { autoClose: 2000 });

        }

    }

    return (

        <Card id="customerDetails">
            <ToastContainer />
            <div className="flex gap-2 mb-4">


                <Input
                    type="text"
                    placeholder="Tìm gói theo ID"
                    suffix={<TbSearch className="text-lg" />}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            Find(inputValue);
                        }
                    }}
                />


                <button type='button'
                    onClick={() => Find(inputValue)}

                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Tìm
                </button>
                <div className="flex items-end gap-4 w-full">


                </div>
            </div>
            <h4 className="mb-6"></h4>



            <FormItem
                label="ID"
                invalid={Boolean(errors.lastName)}
                errorMessage={errors.lastName?.message}
            >
                <Controller
                    name="index"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="ID"
                            id='index'
                            {...field}
                            value={selectedPackage ? selectedPackage.id : ""}
                            onChange={(e) => {
                                setSelectedPackage((prev) => ({
                                    ...prev!,
                                    id: e.target.value,
                                }));
                                field.onChange(e);
                            }}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Tên Gói"
                invalid={Boolean(errors.firstName)}
                errorMessage={errors.firstName?.message}
            >
                <Controller
                    name="packagename"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            id="packagename"
                            autoComplete="off"
                            placeholder="Tên gói"
                            {...field}
                            value={selectedPackage ? selectedPackage.package_name : ""}
                            onChange={(e) => {
                                setSelectedPackage((prev) => ({
                                    ...prev!,
                                    package_name: e.target.value,
                                }));
                                field.onChange(e);
                            }}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Giá"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}



            >
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            autoComplete="off"
                            placeholder="Giá"
                            id="price"
                            value={selectedPackage ? selectedPackage.price : ""}
                            onChange={(e) => {
                                setSelectedPackage((prev) => ({
                                    ...prev!,
                                    price: Number(e.target.value),
                                }));
                                field.onChange(e);
                            }}
                        />
                    )}
                />
            </FormItem>
            <FormItem label="Ngày"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}>
                <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            autoComplete="off"
                            placeholder="Ngày"
                            id="day"
                            value={selectedPackage ? selectedPackage.day : ""}
                            onChange={(e) => {
                                setSelectedPackage((prev) => ({
                                    ...prev!,
                                    day: Number(e.target.value),
                                }));
                                field.onChange(e);
                            }}
                        />
                    )}
                />

            </FormItem>
            <FormItem
                label="Mô tả"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            rows={6} // Tăng chiều cao
                            placeholder="Nhập mô tả..."
                            id="description"
                            className="w-full px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg border-none outline-none"
                            // {...field}
                            value={selectedPackage ? selectedPackage.description : ""}
                            onChange={(e) => {
                                setSelectedPackage((prev) => ({
                                    ...prev!,
                                    description: e.target.value,
                                }));
                                field.onChange(e);
                            }}
                        />
                    )}
                />
            </FormItem>

            <div className="flex items-end gap-4 w-full">

            </div>
            <div className="flex items-center gap-4 w-full justify-end mb-4">
                <button type="button"
                    onClick={handleDelete}
                    disabled={selectedPackage2 === null}
                    className={`px-4 py-2 rounded-md text-white 
                        ${!selectedPackage2 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-blue-600"}`}>
                    Xóa
                </button>
                <button type="button"
                    onClick={handleChange}
                    disabled={selectedPackage2 === null}
                    className={`px-4 py-2 rounded-md text-white 
                        ${!selectedPackage2 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
                    Cập nhật
                </button>

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={selectedPackage2 !== null} // Disable nếu tìm thấy package
                    className={`px-4 py-2 rounded-md text-white 
                ${selectedPackage2 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-blue-600"}`}>
                    Tạo
                </button>


            </div>



        </Card>

    )
}

export default CustomerDetailSection
