const xlsx = require('xlsx');
const fs = require('fs');
const { error } = require('console');

// Read the existing Excel file
try{
const workbook = xlsx.readFile('test.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Calculate bonuses and add new columns
const updatedData = data.map(employee => {
    const salary = employee.AnnualSalary;
    let bonusPercentage, bonusAmount;

    if (salary < 50000) {
        bonusPercentage = 0.05;
    } else if (salary >= 50000 && salary <= 100000) {
        bonusPercentage = 0.07;
    } else {
        bonusPercentage = 0.1;
    }

    bonusAmount = salary * bonusPercentage;

    return {
        ...employee,
        BonusPercentage: bonusPercentage,
        BonusAmount: bonusAmount,
    };
});

// Create a new worksheet with updated data
const newSheet = xlsx.utils.json_to_sheet(updatedData);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'EmployeeBonuses');

// Write to a new Excel file
const outputFile = 'employees_with_bonuses.xlsx';
xlsx.writeFile(newWorkbook, outputFile);

console.log(`Data with bonuses written to ${outputFile}`);
}catch(error){
    console.error('Error reading or processing the Excel file')
}
