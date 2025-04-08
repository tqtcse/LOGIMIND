import React, { useState } from 'react';
import {
    AlertCircle, User, Briefcase, Building, Facebook, CheckCircle, LogIn,
    BarChart,
    Users,
    MessageCircle,
    Package,
    CreditCard,
    UserCog, Contact, GraduationCap, Code2, Linkedin
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { FaInfoCircle } from 'react-icons/fa';

const CloudButton: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activePage, setActivePage] = useState('overview');
    const features = [
        {
            icon: <LogIn className="w-6 h-6 text-green-600 mt-1" />,
            title: "Trang đăng nhập",
            desc: "Sử dụng JWT để xác thực và gọi APIs từ Backend.",
        },
        {
            icon: <BarChart className="w-6 h-6 text-green-600 mt-1" />,
            title: "Trang thống kê",
            desc: "Giao diện trực quan, tùy chỉnh để theo dõi lợi nhuận, đơn hàng, và người dùng.",
        },
        {
            icon: <Users className="w-6 h-6 text-green-600 mt-1" />,
            title: "Quản lý khách hàng",
            desc: "Xem thông tin, tìm kiếm nhanh và quản lý hiệu quả.",
        },
        {
            icon: <MessageCircle className="w-6 h-6 text-green-600 mt-1" />,
            title: "Giao diện chat",
            desc: "Hỗ trợ markdown, sao chép, và tích hợp APIs OpenAI.",
        },
        {
            icon: <Package className="w-6 h-6 text-green-600 mt-1" />,
            title: "Quản lý gói dịch vụ",
            desc: "Hỗ trợ CRUD đầy đủ cho các gói dịch vụ.",
        },
        {
            icon: <CreditCard className="w-6 h-6 text-green-600 mt-1" />,
            title: "Tích hợp thanh toán PayOS",
            desc: "APIs PayOS và WebSocket cho thanh toán mượt mà.",
        },
        {
            icon: <UserCog className="w-6 h-6 text-green-600 mt-1" />,
            title: "Cập nhật thông tin người dùng",
            desc: "Chỉnh sửa và quản lý thông tin dễ dàng.",
        },
    ];
    const showPopUp = () => {
        setIsPopupOpen(true);

    };

    const closePopUp = () => {
        setIsPopupOpen(false);
    };
    const PopupContent = () => (
        <div className="w-[90%] max-w-2xl h-[80vh] bg-white rounded-lg shadow-lg p-6 relative overflow-y-auto">
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
                onClick={closePopUp}
            >
                ✕
            </button>

            {/* Navigation Buttons */}
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activePage === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActivePage('overview')}
                >
                    Tổng quan
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activePage === 'features' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActivePage('features')}
                >
                    Tính năng
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold ${activePage === 'more' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActivePage('more')}
                >
                    Thông tin thêm
                </button>
            </div>

            {/* Page Content */}
            {activePage === 'overview' ? (
                <Card className="bg-white text-gray-800 shadow-xl rounded-2xl p-6 space-y-6">
                    {/* Lưu ý quan trọng */}
                    <div>
                        <h2 className="flex items-center text-2xl font-bold text-blue-600 mb-2">
                            <FaInfoCircle className="mr-2" />
                            Giới thiệu
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed pl-2">
                            LogiMind là website cho phép người dùng tải lên các tài liệu chuyên ngành để tinh chỉnh mô hình AI, từ đó hỗ trợ hiệu quả việc truy vấn và khai thác thông tin trong lĩnh vực logistics.
                        </p>

                    </div>

                    {/* Reference */}
                    <div className='mt-5'>
                        <h2 className="flex items-center text-2xl font-bold text-blue-600 mb-4">
                            <Contact className="w-6 h-6 mr-2" />
                            Người thuê (Reference)
                        </h2>
                        <ul className="space-y-2 pl-4 text-gray-700">
                            <li className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                Họ và tên: <span className="font-medium ml-1">Nguyễn Minh Sơn</span>
                            </li>
                            <li className="flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                                Chức danh: <span className="ml-1">IOS Developer</span>
                            </li>
                            <li className="flex items-center">
                                <Building className="w-5 h-5 mr-2 text-gray-500" />
                                Công ty: <span className="ml-1">FPT Telecom</span>
                            </li>
                            <li className="flex items-center">
                                <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                                Liên hệ:{" "}
                                <a
                                    href="https://www.facebook.com/nguyen.minh.son9999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 ml-1"
                                >
                                    https://www.facebook.com/nguyen.minh.son9999
                                </a>
                            </li>

                        </ul>
                        <h2 className="flex items-center text-2xl font-bold text-red-600 mb-2 mt-5">
                            <AlertCircle className="w-6 h-6 mr-2" />
                            Lưu ý quan trọng
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed pl-2">

                            Website hiện tại là phiên bản demo, được thiết kế để giới thiệu các tính năng cơ bản của giao diện quản trị (admin).
                            <span className="italic text-gray-600 block mt-1">
                                ⚠️ Lưu ý: Chưa hỗ trợ các tính năng liên quan đến Tune Model.
                            </span>
                        </p>
                    </div>
                </Card>
            ) : activePage === 'more' ? (
                <Card className="bg-white text-gray-800 shadow-xl rounded-2xl p-6 space-y-6">
                    {/* Lưu ý quan trọng */}
                    <div>
                        <h2 className="flex items-center text-2xl font-bold text-black-600 mb-2">

                            Thông tin thêm
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed pl-2">
                            Có thể truy cập vào đường dẫn này để xem bản chính thức của dự án
                            <a
                                href="http://103.15.51.22:5174/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 ml-1"
                            >
                                http://103.15.51.22:5174
                            </a>

                        </p>
                        <span className="italic text-gray-600 block mt-1">
                            ⚠️ Lưu ý: Chỉ thao tác được các chức năng của user.
                        </span>
                    </div>

                    {/* Reference */}

                    <div className="mt-8">

                        <h2 className="flex items-center text-2xl font-bold text-blue-600 mb-4">
                            <Contact className="w-6 h-6 mr-2" />
                            Thành viên dự án
                        </h2>
                        <ul className="space-y-2 pl-4 text-gray-700">
                            <li className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                Họ và tên: <span className="font-medium ml-1">Trần Quốc Toàn</span>
                            </li>
                            <li className="flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                                Trường: <span className="ml-1">Đại học Bách Khoa - ĐHQG.TPHCM</span>
                            </li>
                            <li className="flex items-center">
                                <Code2 className="w-5 h-5 mr-2 text-gray-500" />
                                Ngành: <span className="ml-1">Khoa học máy tính</span>
                            </li>
                            <li className="flex items-center">
                                <Linkedin className="w-5 h-5 mr-2 text-blue-600" />
                                Liên hệ:{" "}
                                <a
                                    href="https://www.linkedin.com/in/tqtcse/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 ml-1"
                                >
                                    https://www.linkedin.com/in/tqtcse
                                </a>
                            </li>
                            <li className="flex items-center">

                            </li>
                            <li className="flex items-center">

                            </li>
                            <li className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                Họ và tên: Võ Minh Thịnh <span className="font-medium ml-1"></span>
                            </li>
                            <li className="flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                                Trường: <span className="ml-1">Đại học Khoa Học Tự Nhiên - ĐHQG.TPHCM</span>
                            </li>
                            <li className="flex items-center">
                                <Code2 className="w-5 h-5 mr-2 text-gray-500" />
                                Ngành: <span className="ml-1">Khoa học dữ liệu</span>
                            </li>
                            <li className="flex items-center">
                                <Linkedin className="w-5 h-5 mr-2 text-blue-600" />
                                Liên hệ:{" "}
                                <a
                                    href="https://www.linkedin.com/in/vmthinh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 ml-1"
                                >
                                    https://www.linkedin.com/in/vmthinh
                                </a>
                            </li>
                        </ul>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white text-gray-800 shadow-xl rounded-2xl p-6 space-y-6">
                    <div className="text-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">✨ Các tính năng nổi bật</h2>
                        <div className="space-y-6">
                            <div className="space-y-6">
                                {features.map((item, idx) => (
                                    <div key={idx} className="flex items-start space-x-3">
                                        {item.icon}
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-700">{item.title}</h3>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>

    );

    return (
        <>
            <button
                className="relative px-6 py-3 bg-transparent border-none outline-none cursor-pointer group"
                onClick={showPopUp}
            >
                <svg
                    width="150"
                    height="130"
                    viewBox="0 0 80 40"
                    className="fill-blue-200 group-hover:fill-blue-300 transition-colors duration-300 animate-float"
                >
                    <path d="M60 20c0-5-5-10-10-10-2 0-4 1-6 2-2-5-7-7-12-7-8 0-15 6-15 14 0 1 0 2 1 3h-8c-2 0-4 2-4 4s2 4 4 4h50c2 0 4-2 4-4s-2-4-4-4z" />
                </svg>
                <span className="absolute top-0 left-10 w-4 h-4 bg-white rounded-full opacity-70 animate-puff1 group-hover:scale-110 transition-transform"></span>
                <span className="absolute top-5 left-20 w-3 h-3 bg-white rounded-full opacity-50 animate-puff2 group-hover:scale-125 transition-transform"></span>
                <span className="absolute top-2 left-30 w-5 h-5 bg-white rounded-full opacity-60 animate-puff3 group-hover:scale-105 transition-transform"></span>
                <span className="absolute inset-0 flex items-center justify-center text-white font-['Inter'] font-bold group-hover:text-gray-200 group-hover:scale-105 transition-all left-[-10px] animate-float">
                    Click Me!
                </span>
            </button>

            {isPopupOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={closePopUp}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <PopupContent />
                    </div>
                </div>
            )}
        </>
    );
};

// Inject custom animations via a style tag
const style = document.createElement('style');
style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
    @keyframes float {
        0% { transform: translateY(0) translateX(0) rotate(0deg); }
        25% { transform: translateY(-10px) translateX(5px) rotate(2deg); }
        75% { transform: translateY(-8px) translateX(-5px) rotate(-2deg); }
        100% { transform: translateY(0) translateX(0) rotate(0deg); }
    }
    @keyframes puff1 {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
        50% { transform: translateY(-15px) translateX(8px) scale(1.3); opacity: 0.9; }
        100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
    }
    @keyframes puff2 {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
        50% { transform: translateY(-12px) translateX(-6px) scale(1.4); opacity: 0.8; }
        100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
    }
    @keyframes puff3 {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-14px) translateX(10px) scale(1.35); opacity: 0.85; }
        100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
    }
    .animate-float {
        animation: float 2.5s infinite ease-in-out;
    }
    .animate-puff1 {
        animation: puff1 1.8s infinite ease-in-out;
    }
    .animate-puff2 {
        animation: puff2 1.6s infinite ease-in-out;
    }
    .animate-puff3 {
        animation: puff3 2s infinite ease-in-out;
    }
`;
document.head.appendChild(style);

export default CloudButton;