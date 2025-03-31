import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
// import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCustomerList from '../hooks/useCustomerList'
import { TbChecks } from 'react-icons/tb'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const CustomerListSelected = () => {
    const {
        selectedCustomer,
        customerList,
        mutate,
        customerListTotal,
        setSelectAllCustomer,
    } = useCustomerList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false)
    const [sendMessageLoading, setSendMessageLoading] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)


    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = async () => {
        try {
            // Gửi yêu cầu DELETE từng khách hàng trong danh sách đã chọn
            const token = localStorage.getItem("token")
            // console.log(token)
            await Promise.all(

                selectedCustomer.map(async (customer) => {
                    // console.log(`${API_BASE_URL}/delete-account/${customer.id}`)
                    await axios.delete(`${API_BASE_URL}/account/delete-account/${customer.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                })
            );

            // Cập nhật danh sách sau khi xóa thành công
            const newCustomerList = customerList.filter(
                (customer) => !selectedCustomer.some((selected) => selected.id === customer.id)
            );

            setSelectAllCustomer([]); // Bỏ chọn tất cả khách hàng
            mutate(
                {
                    list: newCustomerList,
                    total: customerListTotal - selectedCustomer.length,
                },
                false,
            );
            setDeleteConfirmationOpen(false);

            toast.success("Xóa thành công!", { autoClose: 1000 });

        } catch (error: any) {
            console.error("Lỗi khi xóa khách hàng:", error.response?.data || error.message);
        }
    }

    const handleSend = () => {
        setSendMessageLoading(true)
        setTimeout(() => {
            // toast.push(
            //     <Notification type="success">Message sent!</Notification>,
            //     { placement: 'top-center' },
            // )
            setSendMessageLoading(false)
            setSendMessageDialogOpen(false)
            setSelectAllCustomer([])
        }, 500)
    }

    return (
        <>
            <ToastContainer />
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedCustomer.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedCustomer.length}{' '}
                                                Khách hàng
                                            </span>
                                            <span>được chọn</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Xóa
                                </Button>

                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Xóa khách hàng"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Xác nhận xóa khách hàng.{' '}
                </p>
            </ConfirmDialog>
            <Dialog
                isOpen={sendMessageDialogOpen}
                onRequestClose={() => setSendMessageDialogOpen(false)}
                onClose={() => setSendMessageDialogOpen(false)}
            >

                <Avatar.Group
                    chained
                    omittedAvatarTooltip
                    className="mt-4"
                    maxCount={4}
                    omittedAvatarProps={{ size: 30 }}
                >
                    {selectedCustomer.map((customer) => (
                        <Tooltip key={customer.id} title={customer.name}>
                            <Avatar size={30} src={customer.img} alt="" />
                        </Tooltip>
                    ))}
                </Avatar.Group>
                <div className="my-4">
                    <RichTextEditor content={''} />
                </div>
                <div className="ltr:justify-end flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => setSendMessageDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        loading={sendMessageLoading}
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default CustomerListSelected
