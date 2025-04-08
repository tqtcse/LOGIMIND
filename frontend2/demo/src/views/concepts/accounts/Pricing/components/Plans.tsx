import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { usePricingStore } from '../store/pricingStore'
import { apiGetPricingPlans } from '@/services/AccontsService'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import useQuery from '@/utils/hooks/useQuery'
import useSWR from 'swr'
import { NumericFormat } from 'react-number-format'
import { TbCheck } from 'react-icons/tb'
import type { GetPricingPanResponse } from '../types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CryptoJS from "crypto-js";


const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_LOCAL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PackageType {
    id: string;
    day: number;
}

const Plans = () => {
    const [packages, setPackages] = useState<PackageType[]>([])
    const { paymentCycle, setPaymentDialog, setSelectedPlan } =
        usePricingStore()

    const query = useQuery()
    const subcription = query.get('subcription')
    const cycle = query.get('cycle')

    const lmao = (e: any) => {
        // console.log(e//CryptoJS.AES.encrypt(email, secretKey).toString()
        localStorage.setItem("begin", CryptoJS.AES.encrypt(e.price.monthly.toString(), secretKey).toString())
        localStorage.setItem("beginid", CryptoJS.AES.encrypt(e.id, secretKey).toString())

        // console.log(localStorage.getItem("beginid"))
    }

    const { data } = useSWR(
        ['/api/pricing'],
        () => apiGetPricingPlans<GetPricingPanResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )


    useEffect(() => {
        // sessionStorage.removeItem("hasReloadedCreatePackage")
        const hasReloadedCreatePackage = sessionStorage.getItem("hasReloadedsPricing");
        if (!hasReloadedCreatePackage) {
            sessionStorage.setItem("hasReloadedsPricing", "true");
            window.location.reload();
        }
    }, []);
    useEffect(() => {

        // 

        const hasReloaded = sessionStorage.getItem("hasReloaded");

        if (!hasReloaded) {
            sessionStorage.setItem("hasReloaded", "true");
            window.location.reload();
        }

        const getPackages = async () => {
            const token = localStorage.getItem("token")
            try {
                const response = await axios.get(`${API_BASE_URL}/packages/packages`,

                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                )

                // console.log(response.data)
                setPackages(response.data)

            } catch (err) {
                console.log(err)
            }
        }

        getPackages()

    }, [])

    const getDaysById = (id: any) => {
        const pkg = packages.find(pkg => pkg.id === id);
        return pkg ? pkg.day : "N/A";
    };
    // sessionStorage.removeItem("hasReloaded");

    // console.log("feature list", featuresList)

    const mergedData: Record<string, { id: string; description: Record<string, string> }> = {};

    if (data && data.plans) {
        // console.log("plan ", data.plans);

        var Role = localStorage.getItem("role")
        if (Role) {
            const decryptedBytes = CryptoJS.AES.decrypt(Role, secretKey);
            Role = decryptedBytes.toString(CryptoJS.enc.Utf8);
        }
        // console.log(Role)
        var filteredData = data.plans
        if (Role !== 'admin') {
            filteredData = data.plans.filter(item => item.id !== "trial_package");
            // console.log(filteredData)
        }
        data.plans = filteredData
        // console.log(filteredData)
        filteredData.forEach(plan => {
            // Tách phần JSON trong description (nằm trong dấu `[]`)
            const match = plan.description.match(/\[(.*?)\]/);
            if (!match) return; // Bỏ qua nếu không có dữ liệu hợp lệ

            let jsonString = match[1].trim();// Chuyển đổi JSON string thành object

            jsonString = jsonString
                .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')  // Thêm dấu " vào key
                .replace(/:\s*'([^']*)'/g, ': "$1"');

            const extractedData = JSON.parse(`[${jsonString}]`);
            extractedData.forEach((item: { id: string; description: string }) => {
                const { id, description } = item;

                if (!mergedData[id]) {
                    mergedData[id] = { id, description: {} };
                }

                mergedData[id].description[plan.id] = description;
            });
        });
    } else {
        // console.log("Không có dữ liệu plans!");
    }

    // console.log("merge_data", mergedData)



    const first1 = (value: string) => {
        const parts = value.split(/(\[[^\]]+\])/);
        const part1 = parts[0].trim();
        return part1
    }



    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
            {data?.plans.map((plan, index) => (
                <div
                    key={plan.id}
                    className={classNames(
                        'px-6 pt-2 flex flex-col justify-between',
                        !isLastChild(data.plans, index) &&
                        'border-r-0 xl:border-r border-gray-200 dark:border-gray-700',
                    )}
                >
                    <div>
                        <h5 className="mb-6 flex items-center gap-2">
                            <span>{plan.name} </span>
                            {plan.recommended && (
                                <Tag className="rounded-full bg-green-200 font-bold">
                                    Recommended
                                </Tag>
                            )}
                        </h5>
                        <div className="">{first1(plan.description)} -  {plan.id}</div>
                        <div className="mt-6">
                            <NumericFormat
                                className="h1"
                                displayType="text"
                                value={plan.price[paymentCycle]}
                                prefix={'$'}
                                // postfix={'C'}
                                thousandSeparator={true}

                            />
                            <span className="text-lg font-bold">
                                {' '}
                                /{' '}
                                {paymentCycle === 'monthly' ? getDaysById(plan.id) + ' ngày' : Number(getDaysById(plan.id)) * 12 + ' ngày'}

                            </span>
                            {/* <div className="">{getDaysById(plan.id)}</div> */}
                        </div>
                        <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                            {Object.values(mergedData).map((feature) => {
                                const description = feature.description[plan.id as string];

                                return (
                                    <div
                                        key={feature.id}
                                        className="flex items-center gap-4 font-semibold heading-text"
                                    >
                                        {plan.features.includes(feature.id) && description && (
                                            <>
                                                <TbCheck className="text-2xl text-primary" />
                                                <span>{description}</span>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-10">
                        <Button
                            block
                            disabled={
                                subcription === plan.id &&
                                cycle === paymentCycle
                            }
                            onClick={() => {
                                setSelectedPlan({
                                    paymentCycle,
                                    planName: plan.name,
                                    price: plan.price,
                                })
                                setPaymentDialog(true)
                                lmao(plan)
                            }}
                        >
                            {subcription === plan.id && cycle === paymentCycle
                                ? 'Current plan'
                                : 'Chọn gói'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Plans
