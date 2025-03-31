import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

type Bill = {
    id: string
    item: string
    status: string
    amount: number
    date: number
    dayLeft: number
}

type BillingHistoryProps = {
    data: Bill[]
    className?: string
}

const { Tr, Th, Td, THead, TBody } = Table

const statusColor: Record<string, string> = {
    paid: 'bg-emerald-500',
    pending: 'bg-amber-400',
}

const columnHelper = createColumnHelper<Bill>()

const columns = [
    columnHelper.accessor('id', {
        header: 'STT',
        cell: (props) => {
            const row = props.row.original
            return (
                <span className="heading-text font-bold cursor-pointer">
                    {row.id}
                </span>
            )
        },
    }),
    columnHelper.accessor('item', {
        header: 'ID Gói',
        cell: (props) => {
            const row = props.row.original
            return <span className="font-semibold">{row.item}</span>
        },
    }),
    columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <Badge className={statusColor[row.status]} />
                    <span className="heading-text font-bold  capitalize">
                        {row.status}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('date', {
        header: 'Ngày đăng kí',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    {dayjs.unix(row.date).format('MM/DD/YYYY')}
                </div>
            )
        },
    }),
    columnHelper.accessor('amount', {
        header: 'Số ngày',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    <NumericFormat
                        displayType="text"
                        value={(Math.round(row.amount * 100) / 100).toFixed(0)}
                        // prefix={'$'}
                        thousandSeparator={true}
                    />
                </div>
            )
        },
    }),
    columnHelper.accessor('dayLeft', {
        header: 'Số ngày còn lại',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    <NumericFormat
                        displayType="text"
                        value={props.row.original.dayLeft}
                        // prefix={'$'}
                        thousandSeparator={true}
                    />
                </div>
            )
        },
    }),
]

const BillingHistory = ({ data = [], ...rest }: BillingHistoryProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <div {...rest} className="overflow-x-auto w-full">
            <Table className="w-full table-auto text-sm md:text-base">
                <THead className="bg-transparent">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className="text-left px-2 py-1 md:px-4 md:py-2 truncate min-w-0 max-w-[120px] md:max-w-none"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td
                                    key={cell.id}
                                    className="text-left px-2 py-1 md:px-4 md:py-2 truncate min-w-0 max-w-[120px] md:max-w-none"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    );
}

export default BillingHistory
