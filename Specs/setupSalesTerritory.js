const path = require("path");
describe("Service Category Creation", async function () {

    /*******************READ EXCEL***********************/
    // Requiring the module
    const xlsxFile = require('read-excel-file/node');
    let xlDataTmp = [];
    let xlData = [];

    // Include fs module
    const fs = require('fs');
    if (fs.readdirSync('../input').length > 1) {
        util.console.error("Error: More than one file, please keep one file");
        return
    } else {
        var file = fs.readdirSync('../input')[0];

        if (file == undefined) {
            util.console.error("Error: Input file not found");
            return
        }

        file = "../input/" + file;

    }

    //xlsxFile('./CX Service Cloud Design Service.xlsx', {
    xlsxFile(file, {
        sheet: 'Territory Setup '
    }).then((rows) => {

        for (let index = 0; index < rows.length; index++) {
            if (rows[index][0] == 'Path: Administrator -> Sales and Campaign Setting -> Sales Territories->Territories') {
                xlData = buildData(index, rows.length);
                console.log(xlData);
                break;
            }

        }
        // Read all the data from input excel file
        function buildData(index, length) {
            for (let i = index + 2; i < length; i++) {
                if (rows[i][0] == null) {
                    break;
                } // Next block of data started
                if (rows[i][2] != null) {
                    xlDataTmp.push(rows[i]);
                }
            }
            return xlDataTmp;
        }
        return xlData;
    });
    /******************************************/

    let counter = 1;
    it(`Step ${ counter++ }: navigate to SAP C4C app`, async function () {
        //const cred = require("../data/loginCredentials.json");

        //Read credentials 
        this.credData = [];
        // Requiring the module
        const reader = require('xlsx');
        const credentials = reader.readFile('../credentials.xlsx');
        const crSheet = credentials.SheetNames;
        for (let j = 0; j < crSheet.length; j++) {

            const tempCred = reader.utils.sheet_to_json(credentials.Sheets[credentials.SheetNames[j]]);
            tempCred.forEach((res) => {
                switch (crSheet[j]) {
                    case 'Credentials':
                        this.credData.push(res);
                        break;
                    default:
                        break;
                }
            });
        }

        //await common.navigation.navigateToUrl(cred.loginCredentials.URL);
        await common.navigation.navigateToUrl(this.credData[0].Tenant);
        //await ui5.session.loginFiori(cred.loginCredentials.Username, cred.loginCredentials.Password);
        await ui5.session.loginFiori(this.credData[0].Username, this.credData[0].Password);
        util.browser.sleep(3000);
    });

    it(`Step ${counter++}: Click Administrator Work Center`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.m.Text",
                "text": "Administrator"
            }
        };
        //await ui5.userInteraction.click(selector);
        await ui5.userInteraction.click(selector);
    });

    it(`Step ${counter++}: Click Sales and Campaign Setting`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.client.m.view.ShellLeftPane.Link",
                "text": "Sales and Campaign Settings"
            }
        };
        await ui5.userInteraction.click(selector);
    });

    it(`Step ${counter++}: Click Territories Link`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.client.m.core.LinkWrapper.Link",
                "text": "Territories"
            }
        };
        await ui5.userInteraction.click(selector);
    });

    it(`Step ${counter++}: Start of Processing`, async function () {
        for (let i = 0; i < xlData.length; i++) {
            //it("Step 06: Click New", async function () {
            const selectorNew = {
                "elementProperties": {
                    "metadata": "sap.client.m.core.base.Button",
                    "text": "New"
                }
            };
            await ui5.userInteraction.click(selectorNew);
            //});

            //it("Step 07: Click New Territory", async function () {
            const selectorOrgUnit = {
                "elementProperties": {
                    "metadata": "sap.m.Button",
                    "text": "New Territory"
                }
            };
            await ui5.userInteraction.click(selectorOrgUnit);
            //});

            //it('Step', async function() {
            if (xlData[i][0]) {
                const selectorName = {
                    "elementProperties": {
                        "metadata": "sap.client.m.core.InputFieldWrapper.InputField",
                        "mProperties": {
                            "type": "Text",
                            "value": [{
                                "path": "/Root/Name"
                            }]
                        }
                    }
                };
                let valueToEnter = xlData[i][0];
                await ui5.userInteraction.clearAndFill(selectorName, valueToEnter);
            }
            //});

            /* if (xlData[i][1]) {
                 const selectorValidTo = {
                     "elementProperties": {
                         "metadata": "sap.client.m.core.DateTimeInputFieldWrapper.DatePickerField",
                         "mProperties": {
                             "value": [{
                                 "path": "/Root/HierarchyLevelCode"
                             }]
                         }
                     }
                 };
                 valueToEnter = xlData[i][1];
                 await ui5.userInteraction.clearAndFill(selectorValidTo, valueToEnter);
             }*/

            //it('Step', async function() {
            if (xlData[i][2]) {

                // F4 Help
                const selectorID = {
                    "elementProperties": {
                        "metadata": "sap.client.m.core.InputFieldWrapper.InputField",
                        "mProperties": {
                            "type": "Text",
                            "value": [{
                                "path": "/Root/ParentTerritoryID_Ded"
                            }]
                        }
                    }
                };
                await ui5.userInteraction.openF4Help(selectorID, 0, 30000, false);


                // Filter 
                const selectorFilter = {
                    "elementProperties": {
                        "metadata": "sap.ui.core.Icon",
                        "src": "sap-icon://filter"
                    }
                };
                await ui5.userInteraction.click(selectorFilter);

                // Fill search value
                const selectorSearchParametersName = {
                    "elementProperties": {
                        "metadata": "sap.client.m.core.InputFieldWrapper.InputField",
                        "mProperties": {
                            "type": "Text",
                            "value": [{
                                "path": "/Root/SearchParameters/Name"
                            }]
                        }
                    }
                };
                valueToEnter = xlData[i][2];
                await ui5.userInteraction.clearAndFill(selectorSearchParametersName, valueToEnter);


                // Hit enter to start search
                await common.userInteraction.pressEnter();

                // Value selection
                const selectorF4Value = {
                    "elementProperties": {
                        "metadata": "sap.client.m.core.base.Text",
                        "bindingContextPath": "/Root/Items/0",
                        "text": [{
                            "path": "./ID"
                        }]
                    }
                };
                await ui5.userInteraction.click(selectorF4Value);
            }
            //});

            //it('Step', async function() {
            if (xlData[i][3]) {
                const selectorOwnerID = {
                    "elementProperties": {
                        "metadata": "sap.client.m.core.InputFieldWrapper.InputField",
                        "mProperties": {
                            "value": [{
                                "path": "/Root/OwnerID"
                            }]
                        }
                    }
                };
                valueToEnter = xlData[i][3];
                await ui5.userInteraction.clearAndFill(selectorOwnerID, valueToEnter);
            }


            //it("Step 15.a: Save", async function () {
            const selectorSave = {
                "elementProperties": {
                    "metadata": "sap.client.m.core.base.Button",
                    "text": "Save"
                }
            };
            await ui5.userInteraction.click(selectorSave);
            util.browser.sleep(10000);
            //});

            /*} catch (err) {
                console.log("Internal error!");
            }*/
        } // End of outer FOR loop
    });

    it(`Step ${counter++}: Prepare sign out`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.ui.unified.ShellHeadItem",
                "id": "shell-header-user-image"
            }
        };
        await ui5.userInteraction.click(selector);
    });

    it(`Step ${counter++}: Sign out`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.m.Button",
                "text": "Sign Out"
            }
        };
        await ui5.userInteraction.click(selector);
    });

    it(`Step ${counter++}: Sign out confirmation`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.m.Button",
                "text": "Yes"
            }
        };
        await ui5.userInteraction.click(selector);
    });
});