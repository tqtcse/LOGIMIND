const { API_BASE_URL_MODEL } = require('../config/env');


const chatAI = async (req, res) => {

    const prompt = req.body.prompt
    const package = req.body.package
    const response = API_BASE_URL_MODEL
    // const response = await fetch(`${API_BASE_URL_MODEL}/api/chat`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ prompt: prompt, package: package }),
    //     credentials: 'include',
    // });

    if (response) {
        return res.json({ response });
    } else {
        return res.status(500).json({ error: 'Lỗi không gọi model được' });
    }
}

const deleteFile = async (req, res) => {
    fileType = req.body.fileType
    if (fileType === '.xlsx' || fileType === '.xls' || fileType === '.XLSX' || fileType === '.XLS') {
        const response = await axios.delete(`${API_BASE_URL_MODEL}/delete/delete_xlsx`, {
            data: { file_name: baseName },
        });
        if (response) {
            return res.json({ message: 'xóa thành công' })
        }
        else {
            return res.status(500).json({ error: 'Lỗi khi xóa' });
        }
    } else {
        const response = await axios.delete(`${API_BASE_URL_MODEL}/delete/delete-uploaded-file`, {
            data: { file_name: baseName, file_type: fileType },
        });
        if (response) {
            return res.json({ message: 'Xóa thành công' })
        }
        else {
            return res.status(500).json({ error: 'Lỗi khi xóa' });
        }
    }

}

module.exports = { chatAI, deleteFile };