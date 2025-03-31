import { useFileManagerStore } from '../store/useFileManagerStore'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL_MODEL = import.meta.env.VITE_API_BASE_URL_MODEL

interface FileData {
    lastModified: string;
    name: string;
    size: number;
    type: string;
}

interface TransformedFile {
    id: string;
    name: string;
    fileType: string;
    srcUrl: string;
    size: number;
    author: object;
    activities: any[];
    permissions: any[];
    uploadDate: number;
    recent: boolean;
}

const transformFiles = (files: FileData[]): TransformedFile[] => {
    return files.map((file, index) => ({
        id: (index + 1).toString(),
        name: file.name,
        fileType: convertFileType(file.type),
        srcUrl: '',
        size: file.size,
        author: {},
        activities: [],
        permissions: [],
        uploadDate: Math.floor(new Date(file.lastModified).getTime() / 1000),
        recent: true,
    }));
};
const convertFileType = (type: string): string => {
    const fileTypeMap: Record<string, string> = {
        'docx': 'doc',
        'xlsx': 'xls',
        'pptx': 'ppt',
    };
    return fileTypeMap[type] || type;
};

const FileManagerDeleteDialog = () => {
    const { deleteDialog, setDeleteDialog, deleteFile } = useFileManagerStore()

    const handleDeleteDialogClose = () => {
        setDeleteDialog({ id: '', open: false })
    }

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.get(`${API_BASE_URL}/file/files`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const transformFile = transformFiles(response.data)
            // console.log(transformFile)
            const fileToDelete = transformFile.find((file, index) => index === (Number(deleteDialog.id) - 1));

            console.log(Number(deleteDialog.id))
            if (!fileToDelete) {
                console.error("File to delete is undefined!");
                return;
            }

            const fileName = fileToDelete.name;
            const lastDotIndex = fileName.lastIndexOf('.');

            // Tách tên file và phần mở rộng
            const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
            const fileType = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

            console.log(fileType)

            try {
                if (fileType === '.xlsx' || fileType === '.xls' || fileType === '.XLSX' || fileType === '.XLS') {
                    console.log('Deleting xlsx file');
                    console.log(baseName)
                    const response = await axios.delete(`${API_BASE_URL_MODEL}/delete/delete_xlsx`, {
                        data: { file_name: baseName },
                    });
                    console.log(response.data);
                } else {
                    const response = await axios.delete(`${API_BASE_URL_MODEL}/delete/delete-uploaded-file`, {
                        data: { file_name: baseName, file_type: fileType },
                    });
                    console.log(response.data);
                }

            } catch (err) {
                console.log('Lỗi khi xóa file:', err);
                return
            }


            console.log(`Deleting file: ${fileToDelete.name}`);
            await axios.delete(`${API_BASE_URL}/file/files/${fileToDelete.name}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            deleteFile(deleteDialog.id)
            toast.success("Xóa thành công!", { autoClose: 1000 });
            setTimeout(() => {
                window.location.reload(); // Reload sau 1 giây
            }, 1000);
            // console.log(deleteDialog.id)
            setDeleteDialog({ id: '', open: false })




        } catch (err) {
            console.log(err)

        }

    }

    return (
        <ConfirmDialog
            isOpen={deleteDialog.open}
            type="danger"
            title="Xóa file"
            onClose={handleDeleteDialogClose}
            onRequestClose={handleDeleteDialogClose}
            onCancel={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
        >
            <p>
                Xác nhận xóa file.{' '}
            </p>
        </ConfirmDialog>
    )
}

export default FileManagerDeleteDialog