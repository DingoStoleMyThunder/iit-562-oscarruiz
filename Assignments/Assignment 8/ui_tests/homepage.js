module.exports = {
  'Demo test Localhost' : function (client) {
    /*
      Check Title of Page
    */
    client
      .url('http://localhost:5000/')
      .waitForElementVisible('body', 1000)
      .assert.title('Oscar Ruiz - Assignment 8')
      ;

    /*
      Check for a navbar brand element
    */
    client
      .expect.element('a')
      .to.have.attribute('class')
      .which.contains('navbar-brand')
      ;

    /*
      Check for "Users" and "Create User" h1 elements
    */
    client
      .useXpath()
      .assert.containsText("//html/body/main/div/div[1]/div[1]/h1", "Users")
      .assert.containsText("//html/body/main/div/div[1]/div[2]/h1", "Create User")
      ;

    /*
      Click the "Users" link and verify the
      new page contains the "User List" h1 element
    */
    client
      .click('//html/body/main/div/div[1]/div[1]/p[2]/a')
      .pause(1000)
      .assert.containsText('/html/body/main/div/div/h1', 'User List')
      ;

    client.end();
  }
}