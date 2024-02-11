import XLSX from 'xlsx';
import fs from 'fs-extra'

 const ExcelConverter =(a)=> {
    let  worksheet = XLSX.utils.json_to_sheet(a);
    let  workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'policy');
    XLSX.writeFile(workbook, 'sample.xlsx');
    return true
}

export default ExcelConverter;