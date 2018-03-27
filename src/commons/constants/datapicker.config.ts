import { IMyDpOptions } from "mydatepicker";

const currentDate = new Date();
const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

export const DATAPICKER_CONFIG: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    editableDateField: false,
    allowSelectionOnlyInCurrentMonth: false,
    showClearDateBtn: false,
    disableUntil: {
        year: currentDate.getFullYear(), 
        month: currentDate.getMonth() + 1, 
        day: currentDate.getDate() - 1
    },
    disableSince:{
        year: maxDate.getFullYear(), 
        month: maxDate.getMonth() + 1, 
        day: maxDate.getDate()
    }
    
}