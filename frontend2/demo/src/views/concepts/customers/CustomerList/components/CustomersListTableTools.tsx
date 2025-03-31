import useCustomerList from '../hooks/useCustomerList'
import CustomerListSearch from './CustomerListSearch'
import cloneDeep from 'lodash/cloneDeep'

const CustomersListTableTools = () => {
    const { tableData, setTableData } = useCustomerList()
    const handleInputChange = (val: string) => {
        // console.log(val)
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CustomerListSearch onInputChange={handleInputChange} />
        </div>
    )
}

export default CustomersListTableTools
