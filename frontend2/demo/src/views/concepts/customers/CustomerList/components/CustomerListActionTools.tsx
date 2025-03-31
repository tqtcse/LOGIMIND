
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import { CSVLink } from 'react-csv'

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    const { customerList } = useCustomerList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="customerList.csv"
                data={customerList}
            >
              
            </CSVLink>
       
        </div>
    )
}

export default CustomerListActionTools
