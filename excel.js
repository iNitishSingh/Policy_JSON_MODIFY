import XLSX from 'xlsx';
import fs from 'fs-extra'

const error={
    policy_no:65767,
    name:"nitish siingh",
    roll_no:34
}


let a = fs.readJSONSync('./policy_response.json');
     a.push(error)
     fs.writeJsonSync('./policy_response.json',a)

 const ExcelConverter =()=> {
    let  worksheet = XLSX.utils.json_to_sheet(a);
let  workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'policy');
    XLSX.writeFile(workbook, 'sample.xlsx');
    return true
}

export default ExcelConverter();