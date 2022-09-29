const path = require("path");
describe("Service Category Creation", async function () {

    /*******************READ EXCEL - START***********************/
    // Read input excel file data
    let xlData = [],
        credData = [];
    let fileReader = require("./readExcel.js");
    xlData = fileReader.xlData;

    if (!xlData) {
        util.console.error("Error: No data found");
        return
    }

    credData = fileReader.cred;
    if (!credData) {
        util.console.error("Error: Credentials are missing!");
        return
    }
    /******************READ EXCEL - END************************/

    let counter = 1;
    it(`Step ${ counter++ }: navigate to SAP C4C app`, async function () {
        await common.navigation.navigateToUrl(credData[0].Tenant);
        await ui5.session.loginFiori(credData[0].Username, credData[0].Password);
        util.browser.sleep(3000);
    });

    it(`Step ${counter++}: Click Administrator Work Center`, async function () {
        const selector = {
            "elementProperties": {
                "metadata": "sap.m.Text",
                "text": "Administrator"
            }
        };
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

    // Data processing started...
    for (let i = 0; i < xlData.length; i++) {

        it(`Step ${counter++}: Click New`, async function () {
            const selectorNew = {
                "elementProperties": {
                    "metadata": "sap.client.m.core.base.Button",
                    "text": "New"
                }
            };
            await ui5.userInteraction.click(selectorNew);
        });

        it(`Step ${counter++}: Click New Territory`, async function () {
            const selectorOrgUnit = {
                "elementProperties": {
                    "metadata": "sap.m.Button",
                    "text": "New Territory"
                }
            };
            await ui5.userInteraction.click(selectorOrgUnit);
        });

        it(`Step ${counter++}: Fill Name = ${xlData[i][0]}`, async function () {
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
        });

        /* Filed is non-editable at screen hence commented below code
        it(`Step ${counter++}: Territory Level = ${xlData[i][1]}`, async function () {
            if (xlData[i][1]) {
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
            }
        })
        */

        it(`Step ${counter++}: Open F4Help`, async function () {
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
            }
        });

        it(`Step ${counter++}: Open Advance filter`, async function () {
            // Filter 
            const selectorFilter = {
                "elementProperties": {
                    "metadata": "sap.ui.core.Icon",
                    "src": "sap-icon://filter"
                }
            };
            await ui5.userInteraction.click(selectorFilter);
        });

        it(`Step ${counter++}: Enter search value = ${xlData[i][2]}`, async function () {
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
        });

        it(`Step ${counter++}: Select value`, async function () {
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
        });

        it(`Step ${counter++}: Enter owner value = ${xlData[i][3]}`, async function () {
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
        });


        it(`Step ${counter++}: Save`, async function () {
            const selectorSave = {
                "elementProperties": {
                    "metadata": "sap.client.m.core.base.Button",
                    "text": "Save"
                }
            };
            await ui5.userInteraction.click(selectorSave);
            util.browser.sleep(10000);
        });

        /*} catch (err) {
            console.log("Internal error!");
        }*/
    } // Outer FOR loop end

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