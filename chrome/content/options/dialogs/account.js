// Gmail Manager
// By Todd Long <longfocus@gmail.com>
// http://www.longfocus.com/firefox/gmanager/

var gmanager_OptionsAccount = new function()
{
  this.__proto__ = new gmanager_BundlePrefix("gmanager-options-");
  
  this.load = function()
  {
    // Unwrap the window arguments
    if ("arguments" in window && window.arguments.length > 0)
    {
      // window.arguments[0] : manager
      // window.arguments[1] : email
      
      this._manager = window.arguments[0];
      this._email = window.arguments[1];
      
      if (this._email)
        this._account = this._manager.getAccount(this._email);
      else
        this._account = this._manager.defaultAccount;
    }
    
    // Check if the account is specified
    if (!this._account)
    {
      // Close the dialog
      window.close();
    }
    
    // Display the email (if available)
    document.getElementById("gmanager-options-account-email").value = this._account.email;
    document.getElementById("gmanager-options-account-email").disabled = this._email;
    
    // Display the alias
    var alias = this._account.node.getAttribute("alias");
    document.getElementById("gmanager-options-account-alias").value = (alias ? alias : "");
    
    // Display the password
    var password = this._account.node.getAttribute("password");
    document.getElementById("gmanager-options-account-password").value = (password ? password : "");
    
    // Load the page preferences
    gmanager_Prefs.loadPrefs(this._account.node, document);
    
    this.input();
  }
  
  this.input = function()
  {
    // Account
    document.getElementById("gmanager-options-account-alias").disabled = (document.getElementById("gmanager-options-account-email").value == "");
    document.getElementById("gmanager-options-account-password").disabled = (document.getElementById("gmanager-options-account-email").value == "");
    
    // Check messages
    var isCheck = document.getElementById("gm-prefs-notifications-check").checked;
    document.getElementById("gm-prefs-notifications-check-interval").disabled = !isCheck;
    
    // Sounds
    var isSound = document.getElementById("gm-prefs-notifications-sounds").checked;
    document.getElementById("gm-prefs-notifications-sounds-file").disabled = !isSound;
    document.getElementById("gm-prefs-notifications-sound-browse").disabled = !isSound;
    document.getElementById("gm-prefs-notifications-sound-preview").disabled = (!isSound || (isSound && document.getElementById("gm-prefs-notifications-sounds-file").value == ""));
  }
  
  this.selectSoundFile = function()
  {
    var path = gmanager_Sounds.selectFile();
    if (path)
      document.getElementById("gm-prefs-notifications-sounds-file").value = path;
  }
  
  this.previewSoundFile = function()
  {
    gmanager_Sounds.play(document.getElementById("gm-prefs-notifications-sounds-file").value);
  }
  
  this.dialogAccept = function()
  {
    var email = document.getElementById("gmanager-options-account-email").value;
    var alias = document.getElementById("gmanager-options-account-alias").value;
    var password = document.getElementById("gmanager-options-account-password").value;
    
    // Check if the email is valid
    if (email.search(/^.+@.+\..+$/) == -1)
    {
      // The email is not valid
      alert(gmanager_Bundle.getString("gmanager-login-valid-email"));
      
      // Keep the dialog open
      return false;
    }
    
    // Save the page preferences
    gmanager_Prefs.savePrefs(this._account.node, document);
    
    if (this._account && this._email)
    {
      // Update the account alias and password
      this._account.node.setAttribute("alias", alias);
      this._account.node.setAttribute("password", password);
    }
    else
    {
      // Create the account
      var account = this._manager.addAccount("gmail", email, alias, password, this._account.node);
      
      // Check if the account was created
      if (!account)
      {
        // The email already exists
        alert(this.getString("email-exists"));
        
        // Keep the dialog open
        return false;
      }
    }
    
    // Close the dialog
    return true;
  }
}