import { mock } from '../MockAdapter'

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



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

mock.onGet(`/api/files`).reply(async (config) => {
    try {
        const token = localStorage.getItem("token")

        const response = await axios.get(`${API_BASE_URL}/file/files`, {
            headers: { Authorization: `Bearer ${token}` },
        })


        const transformFile = transformFiles(response.data)



        const resp2 = {
            list: transformFile,
            directory: []
        }

        return [200, resp2]

    } catch (err) {
        const resp = 1
        console.log(err)
        return [200, resp]
    }

})
