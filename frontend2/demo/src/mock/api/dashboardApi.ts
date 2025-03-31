import { mock } from '../MockAdapter'
import {
    eCommerceData,

} from '../data/dashboardData'
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Order {
    id: string;
    id_account: string;
    id_package: string;
    expired_datetime: string;
    updated_datetime: string;
}

interface Packages {
    id: string;
    package_name: string;
    price: number;
    description: string;
    day: number;
    updated_datetime: string;
}

interface User {
    id: string;
    address: string;
    created_datetime: string;

}
const getRecentOrders = (orders: Order[]) => {
    return orders
        .sort((a, b) => new Date(b.updated_datetime).getTime() - new Date(a.updated_datetime).getTime())
        .slice(0, 20);
};


const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

const calculateWeeklySalesChart = (orders: Order[], packages: Packages[]) => {
    // Lấy ngày hiện tại
    const now = new Date();

    // Xác định ngày đầu tuần (Thứ Hai)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Xác định ngày cuối tuần (Chủ Nhật)
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);


    // Khởi tạo mảng doanh thu theo thứ tự Mon → Sun
    const weeklySales = Array(7).fill(0);

    // Lọc đơn hàng trong tuần hiện tại
    orders.filter(order => {
        const orderDate = new Date(order.updated_datetime);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
    }).forEach(order => {
        const orderDate = new Date(order.updated_datetime);
        const dayIndex = orderDate.getDay(); // Lấy chỉ số ngày trong tuần (0 - 6)
        const packageInfo = packages.find(p => p.id === order.id_package);

        if (packageInfo) {
            weeklySales[dayIndex] += packageInfo.price;
        }
    });

    // Sắp xếp lại thứ tự Mon → Sun
    const orderedSales = [
        weeklySales[1], // Monday
        weeklySales[2], // Tuesday
        weeklySales[3], // Wednesday
        weeklySales[4], // Thursday
        weeklySales[5], // Friday
        weeklySales[6], // Saturday
        weeklySales[0], // Sunday
    ];

    return {
        series: [{ name: 'Sales', data: orderedSales }],
        date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
};

const calculateYearlySalesChart = (orders: Order[], packages: Packages[]) => {
    const now = new Date();
    const yearlySales = Array(12).fill(0);

    orders.forEach(order => {
        const orderDate = new Date(order.updated_datetime);
        if (orderDate.getFullYear() === now.getFullYear()) {
            const monthIndex = orderDate.getMonth(); // Tháng từ 0-11
            const packageInfo = packages.find(p => p.id === order.id_package);

            if (packageInfo) {
                yearlySales[monthIndex] += packageInfo.price;
            }
        }
    });

    return {
        series: [{ name: 'Sales', data: yearlySales }],
        date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
};

// 📌 Gọi hàm với dữ liệu thực tế



const calculateTotalProfit = (
    totalCurrentWeek: number, totalPreviousWeek: number,
    totalCurrentMonth: number, totalPreviousMonth: number,
    totalCurrentYear: number, totalPreviousYear: number,
    weeklyChartData: any, monthlyChartData: any, yearlyChartData: any
) => {

    const roundToTwo = (num: number) => Math.round(num * 100) / 100;

    const percentageWeek = totalPreviousWeek ? roundToTwo(((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100) : 0;
    const percentageMonth = totalPreviousMonth ? roundToTwo(((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100) : 0;
    const percentageYear = totalPreviousYear ? roundToTwo(((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100) : 0;

    return {

        thisWeek: {
            value: totalCurrentWeek,
            growShrink: percentageWeek,
            comparePeriod: "so với tuần trước",
            chartData: weeklyChartData
        },
        thisMonth: {
            value: totalCurrentMonth,
            growShrink: percentageMonth,
            comparePeriod: "so với tháng trước",
            chartData: monthlyChartData
        },
        thisYear: {
            value: totalCurrentYear,
            growShrink: percentageYear,
            comparePeriod: "so với năm trước",
            chartData: yearlyChartData
        }


    };
};
const calculateTotalOrder = (
    totalCurrentWeek: number, totalPreviousWeek: number,
    totalCurrentMonth: number, totalPreviousMonth: number,
    totalCurrentYear: number, totalPreviousYear: number,
    weeklyChartData: any, monthlyChartData: any, yearlyChartData: any
) => {

    const roundToTwo = (num: number) => Math.round(num * 100) / 100;

    const percentageWeek = totalPreviousWeek ? roundToTwo(((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100) : 0;
    const percentageMonth = totalPreviousMonth ? roundToTwo(((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100) : 0;
    const percentageYear = totalPreviousYear ? roundToTwo(((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100) : 0;

    return {

        thisWeek: {
            value: totalCurrentWeek,
            growShrink: percentageWeek,
            comparePeriod: "so với tuần trước",
            chartData: weeklyChartData
        },
        thisMonth: {
            value: totalCurrentMonth,
            growShrink: percentageMonth,
            comparePeriod: "so với tháng trước",
            chartData: monthlyChartData
        },
        thisYear: {
            value: totalCurrentYear,
            growShrink: percentageYear,
            comparePeriod: "so với năm trước",
            chartData: yearlyChartData
        }


    };
};
const calculateWeeklyUserChart = (users: User[]) => {
    // Lấy ngày hiện tại
    const now = new Date();

    // Xác định ngày đầu tuần (Thứ Hai)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Xác định ngày cuối tuần (Chủ Nhật)
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);


    // Khởi tạo mảng user theo thứ tự Mon → Sun
    const weeklyUsers = Array(7).fill(0);

    // Lọc dữ liệu để chỉ lấy users có created_datetime trong tuần hiện tại
    users.filter(user => {
        const createdAt = new Date(user.created_datetime);
        return createdAt >= startOfWeek && createdAt <= endOfWeek;
    }).forEach(user => {
        const createdAt = new Date(user.created_datetime);
        const dayIndex = createdAt.getDay(); // Lấy chỉ số ngày trong tuần (0 - 6)

        weeklyUsers[dayIndex] += 1; // Tăng số lượng user theo ngày
    });

    // Sắp xếp lại thứ tự Mon → Sun
    const orderedUsers = [
        weeklyUsers[1], // Monday
        weeklyUsers[2], // Tuesday
        weeklyUsers[3], // Wednesday
        weeklyUsers[4], // Thursday
        weeklyUsers[5], // Friday
        weeklyUsers[6], // Saturday
        weeklyUsers[0], // Sunday
    ];

    return {
        series: [{ name: 'Users', data: orderedUsers }],
        date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
};
const calculateWeeklyOrderChart = (order: Order[]) => {
    // Lấy ngày hiện tại
    const now = new Date();

    // Xác định ngày đầu tuần (Thứ Hai)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Xác định ngày cuối tuần (Chủ Nhật)
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // Khởi tạo mảng user theo thứ tự Mon → Sun
    const weeklyUsers = Array(7).fill(0);

    // Lọc dữ liệu chỉ lấy các đơn hàng trong tuần hiện tại
    order.filter(user => {
        const createdAt = new Date(user.updated_datetime);
        return createdAt >= startOfWeek && createdAt <= endOfWeek;
    }).forEach(user => {
        const createdAt = new Date(user.updated_datetime);
        const dayIndex = createdAt.getDay(); // Lấy chỉ số ngày trong tuần (0 - 6)

        weeklyUsers[dayIndex] += 1; // Tăng số lượng user theo ngày
    });

    // Sắp xếp lại thứ tự Mon → Sun
    const orderedUsers = [
        weeklyUsers[1], // Monday
        weeklyUsers[2], // Tuesday
        weeklyUsers[3], // Wednesday
        weeklyUsers[4], // Thursday
        weeklyUsers[5], // Friday
        weeklyUsers[6], // Saturday
        weeklyUsers[0], // Sunday
    ];

    return {
        series: [{ name: 'Sales', data: orderedUsers }],
        date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
};

const calculateMonthlyUserChart = (users: User[]) => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthlyUsers = Array(daysInMonth).fill(0);

    users.forEach(user => {
        const createdAt = new Date(user.created_datetime);
        if (createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()) {
            const dayIndex = createdAt.getDate() - 1;
            monthlyUsers[dayIndex] += 1;
        }
    });

    return {
        series: [{ name: 'Sales', data: monthlyUsers }],
        date: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    };
};
const calculateMonthlyOrderChart = (users: Order[]) => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthlyUsers = Array(daysInMonth).fill(0);

    users.forEach(user => {
        const createdAt = new Date(user.updated_datetime);
        if (createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()) {
            const dayIndex = createdAt.getDate() - 1;
            monthlyUsers[dayIndex] += 1;
        }
    });

    return {
        series: [{ name: 'Sales', data: monthlyUsers }],
        date: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    };
};
const calculateYearlyUserChart = (users: User[]) => {
    const monthlyUsers = Array(12).fill(0);

    users.forEach(user => {
        const createdAt = new Date(user.created_datetime);
        const monthIndex = createdAt.getMonth(); // Lấy tháng (0 - 11)

        monthlyUsers[monthIndex] += 1;
    });

    return {
        series: [{ name: 'Sales', data: monthlyUsers }],
        date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
};
const calculateYearlyOrderChart = (users: Order[]) => {
    const monthlyUsers = Array(12).fill(0);

    users.forEach(user => {
        const createdAt = new Date(user.updated_datetime);
        const monthIndex = createdAt.getMonth(); // Lấy tháng (0 - 11)

        monthlyUsers[monthIndex] += 1;
    });

    return {
        series: [{ name: 'Sales', data: monthlyUsers }],
        date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
};
const calculateTotalImpression = (
    totalCurrentWeek: number, totalPreviousWeek: number,
    totalCurrentMonth: number, totalPreviousMonth: number,
    totalCurrentYear: number, totalPreviousYear: number,
    weeklyChartData: any, monthlyChartData: any, yearlyChartData: any
) => {

    const roundToTwo = (num: number) => Math.round(num * 100) / 100;

    const percentageWeek = totalPreviousWeek ? roundToTwo(((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100) : 0;
    const percentageMonth = totalPreviousMonth ? roundToTwo(((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100) : 0;
    const percentageYear = totalPreviousYear ? roundToTwo(((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100) : 0;

    return {

        thisWeek: {
            value: totalCurrentWeek,
            growShrink: percentageWeek,
            comparePeriod: "from last week",
            chartData: weeklyChartData
        },
        thisMonth: {
            value: totalCurrentMonth,
            growShrink: percentageMonth,
            comparePeriod: "from last month",
            chartData: monthlyChartData
        },
        thisYear: {
            value: totalCurrentYear,
            growShrink: percentageYear,
            comparePeriod: "from last year",
            chartData: yearlyChartData
        }


    };
};
const transformOrders = (orders: any[], packages: any[]) => {
    return orders.map(order => {
        const packageInfo = packages.find(pkg => pkg.id === order.id_package);

        if (!packageInfo) {
            console.warn(`Không tìm thấy gói cho id_package: ${order.id_package}`);
            return null;
        }

        return {
            id: order.id,
            date: Math.floor(new Date(order.updated_datetime).getTime() / 1000),
            customer: order.id_account,
            status: 0,
            paymentMethod: 'visa',
            paymentIdentifier: '•••• 1232',
            totalAmount: packageInfo.price,
        };
    }).filter(order => order !== null);
};
const calculateStatisticData = (totalProfit: any, totalOrder: any, totalImpression: any, transformOrder: any) => {
    return {
        statisticData: { totalProfit, totalOrder, totalImpression },
        recentOrders: transformOrder,
    }
}

const calculateMonthlySalesChart = (orders: Order[], packages: Packages[]) => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthlySales = Array(daysInMonth).fill(0);

    orders.forEach(order => {
        const orderDate = new Date(order.updated_datetime);
        if (orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()) {
            const dayIndex = orderDate.getDate() - 1;
            const packageInfo = packages.find(p => p.id === order.id_package);

            if (packageInfo) {
                monthlySales[dayIndex] += packageInfo.price;
            }
        }
    });

    return {
        series: [{ name: 'Sales', data: monthlySales }],
        date: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    };
};

const calculateUserTotal = (users: User[], period: 'week' | 'month' | 'year'): number => {
    const now = new Date();
    return users.filter(user => {
        const createdAt = new Date(user.created_datetime);

        switch (period) {
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần (Chủ nhật)
                return createdAt >= startOfWeek;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng
                return createdAt >= startOfMonth;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1); // Đầu năm
                return createdAt >= startOfYear;
            default:
                return false;
        }
    }).length;
};
const calculateOrderTotal = (users: Order[], period: 'week' | 'month' | 'year'): number => {
    const now = new Date();
    return users.filter(user => {
        const createdAt = new Date(user.updated_datetime);

        switch (period) {
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần (Chủ nhật)
                return createdAt >= startOfWeek;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng
                return createdAt >= startOfMonth;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1); // Đầu năm
                return createdAt >= startOfYear;
            default:
                return false;
        }
    }).length;
};

const calculatePreviousUserTotal = (users: User[], period: 'week' | 'month' | 'year'): number => {
    const now = new Date();

    return users.filter((user: User) => {
        const createdAt = new Date(user.created_datetime);

        switch (period) {
            case 'week':
                const startOfThisWeek = new Date(now);
                startOfThisWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần này (Chủ nhật)
                const startOfLastWeek = new Date(startOfThisWeek);
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Đầu tuần trước

                return createdAt >= startOfLastWeek && createdAt < startOfThisWeek;

            case 'month':
                const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng này
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Đầu tháng trước

                return createdAt >= startOfLastMonth && createdAt < startOfThisMonth;

            case 'year':
                const startOfThisYear = new Date(now.getFullYear(), 0, 1); // Đầu năm nay
                const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1); // Đầu năm trước

                return createdAt >= startOfLastYear && createdAt < startOfThisYear;

            default:
                return false;
        }
    }).length;
};

const calculatePreviousOrderTotal = (users: Order[], period: 'week' | 'month' | 'year'): number => {
    const now = new Date();

    return users.filter((user: Order) => {
        const createdAt = new Date(user.updated_datetime);

        switch (period) {
            case 'week':
                const startOfThisWeek = new Date(now);
                startOfThisWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần này (Chủ nhật)
                const startOfLastWeek = new Date(startOfThisWeek);
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Đầu tuần trước

                return createdAt >= startOfLastWeek && createdAt < startOfThisWeek;

            case 'month':
                const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng này
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Đầu tháng trước

                return createdAt >= startOfLastMonth && createdAt < startOfThisMonth;

            case 'year':
                const startOfThisYear = new Date(now.getFullYear(), 0, 1); // Đầu năm nay
                const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1); // Đầu năm trước

                return createdAt >= startOfLastYear && createdAt < startOfThisYear;

            default:
                return false;
        }
    }).length;
};

mock.onGet(`/api/dashboard/ecommerce`).reply(async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_BASE_URL}/order/get-orderDetail`, {
            headers: { Authorization: `Bearer ${token}` },
        })


        const response2 = await axios.get(`${API_BASE_URL}/packages/packages`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        const response3 = await axios.get(`${API_BASE_URL}/user/get-user`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        const order: Order[] = response.data
        const packages: Packages[] = response2.data
        const users = response3.data

        // console.log(packages)




        const calculateCurrentTotal = (timeframe: 'week' | 'month' | 'year') => {
            const now = new Date();
            return order
                .filter(pkg => {
                    const updatedDate = new Date(pkg.updated_datetime);
                    switch (timeframe) {
                        case 'week': {
                            const startOfWeek = new Date(now);
                            startOfWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần
                            return updatedDate >= startOfWeek && updatedDate <= now;
                        }
                        case 'month': {
                            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            return updatedDate >= startOfMonth && updatedDate <= now;
                        }
                        case 'year': {
                            const startOfYear = new Date(now.getFullYear(), 0, 1);
                            return updatedDate >= startOfYear && updatedDate <= now;
                        }
                        default:
                            return false;
                    }
                })
                .reduce((sum, pkg) => {
                    const packageInfo = packages.find(p => p.id === pkg.id_package);
                    return sum + (packageInfo ? packageInfo.price : 0);
                }, 0);
        };

        const calculatePreviousTotal = (timeframe: 'week' | 'month' | 'year') => {
            const now = new Date();
            return order
                .filter(pkg => {
                    const updatedDate = new Date(pkg.updated_datetime);
                    switch (timeframe) {
                        case 'week': {
                            const startOfThisWeek = new Date(now);
                            startOfThisWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần hiện tại
                            const startOfLastWeek = new Date(startOfThisWeek);
                            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
                            return updatedDate >= startOfLastWeek && updatedDate < startOfThisWeek;
                        }
                        case 'month': {
                            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                            return updatedDate >= startOfLastMonth && updatedDate < startOfThisMonth;
                        }
                        case 'year': {
                            const startOfThisYear = new Date(now.getFullYear(), 0, 1);
                            const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
                            return updatedDate >= startOfLastYear && updatedDate < startOfThisYear;
                        }
                        default:
                            return false;
                    }
                })
                .reduce((sum, pkg) => {
                    const packageInfo = packages.find(p => p.id === pkg.id_package);
                    return sum + (packageInfo ? packageInfo.price : 0);
                }, 0);
        };




        const recentOrders = getRecentOrders(order);

        const totalCurrentWeek = calculateCurrentTotal('week');
        const totalPreviousWeek = calculatePreviousTotal('week');

        const totalCurrentMonth = calculateCurrentTotal('month');
        const totalPreviousMonth = calculatePreviousTotal('month');

        const totalCurrentYear = calculateCurrentTotal('year');
        const totalPreviousYear = calculatePreviousTotal('year');

        const percentageWeek = calculatePercentageChange(totalCurrentWeek, totalPreviousWeek);
        const percentageMonth = calculatePercentageChange(totalCurrentMonth, totalPreviousMonth);
        const percentageYear = calculatePercentageChange(totalCurrentYear, totalPreviousYear);



        const weeklyChartData = calculateWeeklySalesChart(order, packages);
        // console.log("📊 Dữ liệu biểu đồ doanh thu tuần:", weeklyChartData);


        const monthlyChartData = calculateMonthlySalesChart(order, packages);
        // console.log("📊 Dữ liệu biểu đồ doanh thu tháng:", monthlyChartData);

        const yearlyChartData = calculateYearlySalesChart(order, packages);
        // console.log("📊 Dữ liệu biểu đồ doanh thu năm:", yearlyChartData);


        const totalCurrentUserWeek = calculateUserTotal(users, 'week');
        const totalPreviousUserWeek = calculatePreviousUserTotal(users, 'week');
        // console.log(totalPreviousUserWeek)
        const totalCurrentUserMonth = calculateUserTotal(users, 'month');
        const totalPreviousUserMonth = calculatePreviousUserTotal(users, 'month');

        const totalCurrentUserYear = calculateUserTotal(users, 'year');
        const totalPreviousUserYear = calculatePreviousUserTotal(users, 'year');

        const percentageUserWeek = calculatePercentageChange(totalCurrentUserWeek, totalPreviousUserWeek);
        const percentageUserMonth = calculatePercentageChange(totalCurrentUserMonth, totalPreviousUserMonth);
        const percentageUserYear = calculatePercentageChange(totalCurrentUserYear, totalPreviousUserYear);


        const totalOrderWeek = calculateOrderTotal(order, 'week');
        const totalOrderPreviousWeek = calculatePreviousOrderTotal(order, 'week');
        const totalOrderMonth = calculateOrderTotal(order, 'month');
        const totalOrderPreviousMonth = calculatePreviousOrderTotal(order, 'month');
        const totalOrderYear = calculateOrderTotal(order, 'year');
        const totalOrderPreviousYear = calculatePreviousOrderTotal(order, 'year');

        const percentageOrderWeek = calculatePercentageChange(totalOrderWeek, totalOrderPreviousWeek);
        const percentageOrderMonth = calculatePercentageChange(totalOrderMonth, totalOrderPreviousMonth);
        const percentageOrderYear = calculatePercentageChange(totalOrderYear, totalOrderPreviousYear);

        const weeklyOrderChartData = calculateWeeklyOrderChart(order);
        const monthlyOrderChartData = calculateMonthlyOrderChart(order);
        const yearlyOrderChartData = calculateYearlyOrderChart(order);

        const weeklyUserChartData = calculateWeeklyUserChart(users);


        const monthlyUserChartData = calculateMonthlyUserChart(users);

        const yearlyUserChartData = calculateYearlyUserChart(users);

        const transformOrder = transformOrders(order, packages)

        const totalProfit = calculateTotalProfit(
            totalCurrentWeek, totalPreviousWeek,
            totalCurrentMonth, totalPreviousMonth,
            totalCurrentYear, totalPreviousYear,
            weeklyChartData, monthlyChartData, yearlyChartData
        );
        const totalOrder = calculateTotalOrder(
            totalOrderWeek, totalOrderPreviousWeek,
            totalOrderMonth, totalOrderPreviousMonth,
            totalOrderYear, totalOrderPreviousYear,
            weeklyOrderChartData, monthlyOrderChartData, yearlyOrderChartData
        );
        const totalImpression = calculateTotalImpression(
            totalCurrentUserWeek, totalPreviousUserWeek,
            totalCurrentUserMonth, totalPreviousUserMonth,
            totalCurrentUserYear, totalPreviousUserYear,
            weeklyUserChartData, monthlyUserChartData, yearlyUserChartData
        );

        // console.log("📊 Tổng hợp doanh thu:", totalProfit);
        const statics = calculateStatisticData(totalProfit, totalOrder, totalImpression, transformOrder)


        const recentOrder = getRecentOrders(order);
        // console.log("📦 20 đơn hàng gần nhất:", recentOrder);

        return [200, statics]

    } catch (err) {
        console.log("err", err)
        return [200, eCommerceData]
    }

})

mock.onGet(`/api/dashboard/ecommerce2`).reply(async () => {
    try {
        return [200, { message: 'Success' }]
    } catch {
        return [500, { error: 'Internal Server Error' }]
    }
})
