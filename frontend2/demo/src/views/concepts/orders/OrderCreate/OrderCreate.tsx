import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import OrderForm from '../OrderForm'
import sleep from '@/utils/sleep'
import { useNavigate } from 'react-router-dom'
import { TbTrash } from 'react-icons/tb'
import type { OrderFormSchema } from '../OrderForm'

const OrderCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: OrderFormSchema) => {
        // console.log('Submitted values', values)
        // setIsSubmiting(true)
        // await sleep(800)
        // setIsSubmiting(false)
        // toast.push(<Notification type="success">Order created!</Notification>, {
        //     placement: 'top-center',
        // })
        // navigate('/concepts/orders/order-list')
    }

   

    return (
        <>
            <OrderForm onFormSubmit={handleFormSubmit}>
                <Container>

                </Container>
            </OrderForm>

        </>
    )
}

export default OrderCreate
