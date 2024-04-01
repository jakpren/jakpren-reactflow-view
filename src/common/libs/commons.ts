import { toast } from 'react-toastify';
export class CommonLib {

    public static mapKeys(mapper: any, values: any) {
        if (values !== null && values !== undefined && values.length > 0) {
            return values.map((value: any) => {
                const newObj: any = {};
                Object.keys(value).map((key: string) => {
                    if (key in mapper) {
                        newObj[mapper[key]] = value[key] || "";
                    } else {
                        newObj[key] = value[key];
                    }
                })
                return newObj;
            })
        }
        return [];
    }

    public static getValueByID = (id: string) => {
        return (document.getElementById(id) as HTMLInputElement)?.value;
    };

    public static json2csv(jsonContent: any, header: any, elementIdsInSequence?: any) {
        if (jsonContent.length > 0) {
            const items = jsonContent;
            if (elementIdsInSequence) {
                const csv = [
                    header.map((value: any) => this.prepareStringToCsv(value)).join(','),
                    ...items.map((row: any) =>
                        elementIdsInSequence.map((id: any) => {
                            if (Array.isArray(row[id]?.response)) {
                                const noOfFiles = row[id].response.length
                                return `${noOfFiles} File(s)`
                            } else {
                                return this.prepareStringToCsv(row[id]?.response || row[id]);
                            }
                        }).join(','))
                ].join('\r\n')
                return csv;
            } else {
                const csv = [
                    header.map((value: any) => this.prepareStringToCsv(value)).join(','),
                    ...items.map((row: any) => (Object.keys(row) as (keyof typeof row)[])
                        .map((key) => this.prepareStringToCsv(row[key])).
                        join(','))
                ].join('\r\n')
                return csv;
            }
        }
        return [];
    }

    public static prepareStringToCsv(string: any) {
        if (typeof string !== 'string') {
            return string;
        }
        if (string.includes('\n') || string.includes(',') || string.includes('"')) {
            return '"' + string.replace(/"/g, '""') + '"';
        } else {
            return string;
        }
    }

    public static removeKeyRecursively(obj: any, key: string) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                switch (typeof (obj[prop])) {
                    case 'object':
                        if (key.indexOf(prop) > -1) {
                            delete obj[prop];
                        } else {
                            CommonLib.removeKeyRecursively(obj[prop], key);
                        }
                        break;
                    default:
                        if (key.indexOf(prop) > -1) {
                            delete obj[prop];
                        }
                        break;
                }
            }
        }
    }

    public static successToast(text: string) {
        toast.dismiss();
        toast.success(text, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 3000,
            theme: "light"
        });
    }

    public static errorToast(text: string) {
        toast.dismiss();
        try {
            toast.error(text, {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000,
                theme: "light"
            });
        }
        catch (e) {
            console.log("error", e);
        }
    }

    public static warnToast(text: string) {
        toast.dismiss();
        toast.warn(text, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 3000,
            theme: "light"
        });
    }

    public static debugLog(message: string, value?: any) {
        console.log(message, value);
    }

    public static getFileType(fileName: string): string | undefined {
        let fileExtension = fileName.split('.').pop();
        if (fileExtension) {
            switch (fileExtension.toLowerCase()) {
                case 'csv':
                    return 'text/csv';
                case 'txt':
                    return 'text/plain';
                case 'doc':
                    return 'application/msword';
                case 'docx':
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                case 'xls':
                    return 'application/vnd.ms-excel';
                case 'xlsx':
                    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                case 'pdf':
                    return 'application/pdf';
                case 'png':
                    return 'image/png';
                case 'jpeg':
                    return 'image/jpeg';
                case 'jpg':
                    return 'image/jpg';
                case 'json':
                    return 'application/json';
                case 'xml':
                    return 'application/xml';
                default:
                    return 'application/octet-stream';
            }
        }
        return undefined;
    };

}