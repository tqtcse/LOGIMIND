import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import CustomerDetailSection from './components/OrderDetailSection'
import { useOrderFormStore } from './store/orderFormStore'
import useSWR from 'swr'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { ReactNode } from 'react'
import type {
    GetProductListResponse,
    OrderFormSchema,
    SelectedProduct,
} from './types'
import type { TableQueries, CommonProps } from '@/@types/common'

type OrderFormProps = {
    children: ReactNode
    onFormSubmit: (values: OrderFormSchema) => void
    defaultValues?: OrderFormSchema
    defaultProducts?: SelectedProduct[]
    newOrder?: boolean
} & CommonProps


const OrderForm = (props: OrderFormProps) => {
    const { onFormSubmit, children, defaultValues, defaultProducts } = props

    const { setProductOption, setProductList, setSelectedProduct } =
        useOrderFormStore()


    useEffect(() => {
        if (defaultProducts) {
            setSelectedProduct(defaultProducts)
        }
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        return () => {
            setSelectedProduct([])
        }

    }, [])

    const onSubmit = (values: OrderFormSchema) => {
        onFormSubmit?.(values)
    }

    const {
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        control,
    } = useForm<OrderFormSchema>({
        defaultValues: {
            paymentMethod: 'creditOrDebitCard',
            packagename: '',
            index: '',
            description: '',
            ...(defaultValues ? defaultValues : {}),
        },
  
    })


    return (
        <div className="flex">
            <Form
                className="flex-1 flex flex-col overflow-hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex gap-4">


                        <div className="flex-1">
                            <div className="flex flex-col gap-4">

                                <CustomerDetailSection
                                    control={control}
                                    errors={errors}
                                />
                               

                            </div>
                        </div>
                    </div>
                </Container>

            </Form>
        </div>
    )
}

export default OrderForm
