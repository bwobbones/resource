appServices.factory("EmailService", function($window) {

  var emailService = {

    send: function(emailAddress, subject, body) {
      var mailto = [];
      mailto.push(emailAddress || "");
      mailto.push("?");
      mailtoParams = [];
      if (subject) mailtoParams.push('subject=' + subject);
      if (body) mailtoParams.push('body=' + body);
      mailto.push(mailtoParams.join("&"));
      $window.location.href = "mailto:" + mailto.join("");
    }

  };

  return emailService;

});
