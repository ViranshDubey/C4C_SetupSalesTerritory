// for more information visit https://github.tools.sap/sProcurement/qmate/blob/main/documentation/topics/gettingStarted/configuration.md
const path = require("path");
const merge = require(path.resolve(process.env.DEEPMERGE_PATH));
// const profile = require(path.resolve(process.env.QMATE_CONFIGS, "chrome.conf.js"));
const profile = require(path.resolve(process.env.QMATE_CONFIGS, "report.conf.js"));

exports.config = merge(profile.config, {
  maxInstances: 1,
  bail: 1,

  params: {
    auth: {
      formType: "plain"
    },
    coverage: true
  },

  // Spec patterns are relative to the current working directory when [5]
  // protractor is called.
  specs: [
    path.resolve(__dirname, "specs/setupSalesTerritory.js")
  ],


});
