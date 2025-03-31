import { useState, useEffect } from 'react'
import BillingHistory from './BillingHistory'
import { apiGetSettingsBilling } from '@/services/AccontsService'
import useSWR from 'swr'
import { useNavigate } from 'react-router-dom'

import type {
    GetSettingsBillingResponse,
    CreditCard,
    CreditCardInfo,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SettingsBilling = () => {
    const navigate = useNavigate()

    const [selectedCard, setSelectedCard] = useState<{
        type: 'NEW' | 'EDIT' | ''
        dialogOpen: boolean
        cardInfo: Partial<CreditCardInfo>
    }>({
        type: '',
        dialogOpen: false,
        cardInfo: {},
    })

    const {
        data = {

            transactionHistory: [],
        },
    } = useSWR(
        '/api/settings/billing/',
        () => apiGetSettingsBilling<GetSettingsBillingResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )








    return (
        <div>

            <div className="mt-8">
                <h5>Lịch sử giao dịch</h5>
                <div></div>
                <BillingHistory
                    className="mt-4"
                    data={data.transactionHistory}
                />
            </div>
      
        
        </div>
    )
}

export default SettingsBilling
