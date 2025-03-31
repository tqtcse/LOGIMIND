import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import RecentOrder from './components/RecentOrder'
import RevenueByChannel from './components/RevenueByChannel'
import { apiGetEcommerceDashboard } from '@/services/DashboardService'
import { apiGetEcommerceDashboard2 } from '@/services/DashboardService'
import useSWR from 'swr'
import type { GetEcommerceDashboardResponse } from './types'

const SalesDashboard = () => {
    const { data, isLoading } = useSWR(
        ['/api/dashboard/ecommerce'],
        () => apiGetEcommerceDashboard<GetEcommerceDashboardResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )
    
    return (
        <Loading loading={isLoading}>
            {data && (
                <div>
                    <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
                        <Overview data={data.statisticData} />
                        <div className="flex flex-col xl:flex-row gap-4">
                            <div className="flex flex-col gap-4 flex-1 xl:col-span-3">

                           
                            </div>
                            <div className="flex flex-col gap-4 2xl:min-w-[360px]">
                              
                            </div>
                        </div>

                        <RecentOrder data={data.recentOrders} />
                    </div>
                </div>
            )}
        </Loading>
    )
}

export default SalesDashboard
