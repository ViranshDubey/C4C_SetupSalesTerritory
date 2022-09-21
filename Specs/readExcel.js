class readExcel {
    constructor() {
        this.xlData = [];
         this.cred = [];

        // Requiring the module
        const reader = require('xlsx');

        // Include fs module
        const fs = require('fs');

        // Get the filename
        if (fs.readdirSync('../input').length > 1) {
            util.console.error("Error: More than one file, please keep one file");
            return
        } else {
            var filename = fs.readdirSync('../input')[0];

            if (filename == undefined) {
                util.console.error("Error: Input file not found");
                return
            }

            filename = "../input/" + filename;
        }

        //Read input sheet
        const fileData = reader.readFile(filename);
        const rows = reader.utils.sheet_to_json(fileData.Sheets["Territory Setup "], {
            header: 1,
            blankrows: true
        });
        for (let index = 0; index < rows.length; index++) {
            if (rows[index][0] == 'Name') {
                this.xlData = buildData(index, rows.length);
                console.log(this.xlData);
                break;
            }
        }

        // Read all the data from input excel file
        function buildData(index, length) {
           let xlDataTmp = [];
            for (let i = index + 1; i < length; i++) {
                // If Territory name is blank then stop further processing
                if (rows[i][0] == null) {
                    break;
                }
                // If Parent Territory is blank then skip the record
                if (rows[i][2] != null) {
                    xlDataTmp.push(rows[i]);
                }
            }
            return xlDataTmp;
        }

        //Read credentials sheet
        const credentials = reader.readFile('../credentials.xlsx');
        const crSheet = credentials.SheetNames;
        for (let j = 0; j < crSheet.length; j++) {

            const tempCred = reader.utils.sheet_to_json(credentials.Sheets[credentials.SheetNames[j]]);
            tempCred.forEach((res) => {
                switch (crSheet[j]) {
                    case 'Credentials':
                        this.cred.push(res);
                        break;
                    default:
                        break;
                }
            });
        }
    }
}
module.exports = new readExcel();