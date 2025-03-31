import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Upload from "@/components/ui/Upload";
import customToast from "@/components/ui/toast";
import { toast, ToastContainer } from 'react-toastify';
import Notification from "@/components/ui/Notification";
import UploadMedia from "@/assets/svg/UploadMedia";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL_MODEL = import.meta.env.VITE_API_BASE_URL_MODEL


const UploadFile = () => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


    const handleFileChange = (files: File[]) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    }

    const handleUploadDialogClose = () => {
        if (!isUploading) setUploadDialogOpen(false);
    };

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) {
            customToast.push(<Notification title={"No files selected!"} type="warning" />, { placement: "top-center" });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        console.log("Upload File", uploadedFiles);

        try {
            const token = localStorage.getItem("token");

            for (const file of uploadedFiles) {
                // console.log("token ", token);
                // const formData = new FormData();
                // formData.append("file", file);
                // console.log("file ", file);

                // 👉 Thêm `onUploadProgress` để theo dõi quá trình upload
                console.log("token ", token);
                const formData = new FormData();

                // Lấy tên file và chuyển phần mở rộng về chữ thường
                const fileName = file.name;
                const extension = fileName.split('.').pop()?.toLowerCase(); // Chuyển đuôi thành chữ thường
                const baseName = fileName.substring(0, fileName.lastIndexOf('.')); // Lấy phần tên file không có đuôi
                const newFileName = extension ? `${baseName}.${extension}` : fileName; // Ghép lại tên file mới

                // Tạo một File mới với tên đã sửa
                const newFile = new File([file], newFileName, { type: file.type });

                // Append file mới vào FormData
                formData.append("file", newFile);

                console.log("file ", newFile);

                setUploadProgress(50);

                // 👉 Xác định API theo loại file
                const type = newFile.name.split('.').pop()?.toLowerCase();
                let api_url = "";
                if (type === "docx" || type === "doc" || type === "DOCX" || type === "DOC") api_url = `${API_BASE_URL_MODEL}/doc/upload`;
                else if (type === "pdf" || type === "PDF") api_url = `${API_BASE_URL_MODEL}/pdf/upload`;
                else if (type === "xlsx" || type === "XL") api_url = `${API_BASE_URL_MODEL}/xlsx/upload`;
                else {
                    customToast.push(<Notification title={`Unsupported file type: ${type}`} type="warning" />, { placement: "top-center" });
                    continue;
                }

                // 👉 Thêm `onUploadProgress` cho quá trình xử lý file trên server
                const response2 = await fetch(api_url, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!response2.ok) {
                    customToast.push(<Notification title={`Processing failed for ${file.name}`} type="danger" />, { placement: "top-center" });
                    setIsUploading(false);
                    return;
                }
                const response = await axios.post(`${API_BASE_URL}/file/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    }
                });

                if (!response) {
                    customToast.push(<Notification title={`Upload failed for ${file.name}`} type="danger" />, { placement: "top-center" });
                    setIsUploading(false);
                    return;
                }

                setUploadProgress(80);
            }

            setUploadProgress(100);
            toast.success("Tải lên thành công!", { autoClose: 1000 });
            setUploadedFiles([]);

        } catch (error) {
            console.error("Upload error:", error);
            customToast.push(<Notification title={"An error occurred during upload"} type="danger" />, { placement: "top-center" });
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                handleUploadDialogClose();
                window.location.reload();
            }, 1000);
        }
    };



    return (
        <>
            <ToastContainer />
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Tải File
            </Button>
            <Dialog isOpen={uploadDialogOpen} onClose={handleUploadDialogClose} onRequestClose={handleUploadDialogClose}>
                <h4>Tải File</h4>
                <Upload draggable multiple className="mt-6 bg-gray-100 dark:bg-transparent" onChange={handleFileChange} onFileRemove={setUploadedFiles}>
                    <div className="my-4 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <UploadMedia height={150} width={200} />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">Drop your files here, or </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 font-semibold opacity-60 dark:text-white">through your machine</p>
                    </div>
                </Upload>

                {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                        <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                        <p className="text-center mt-1 text-gray-600">{uploadProgress}%</p>
                    </div>
                )}

                <div className="mt-4">
                    <Button block loading={isUploading} variant="solid" disabled={uploadedFiles.length === 0} onClick={handleUpload}>
                        {isUploading ? "Đang tải file..." : "Tải file"}
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default UploadFile;
