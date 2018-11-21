// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  "default e2e tests": browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible("#map", 5000)
      .assert.elementPresent(".map-settings-button-container")
      .click(".map-settings-button-container button")
      .waitForElementVisible(".map-settings-panel", 1000)
      .waitForElementPresent("#map-region option[value=Surf_Coast_Shire]", 1000)
      .pause("1000")
      .click("#map-region option[value=Surf_Coast_Shire]")
      .pause("3000")
      .click(".map-settings-button-container button")
      .waitForElementVisible(".map-settings-panel", 1000)
      .click("#map-fire option[value=Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84]")
      .waitForElementNotPresent(".load-spinner-overlay", 10000)
      .pause("6000")
      .end();
  }
};
