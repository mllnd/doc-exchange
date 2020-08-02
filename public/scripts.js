$(document).ready(function() {

  $('select.dropdown').dropdown();

  // Logout button
  $('#logout-btn').on('click', function () {
    $('#logout-form').submit();
  });

  const validationForms = [
    "#login-form",  "#register-form"
  ];
  const validationRules = {
    "#login-form": {
      fields: {
        email: {
          identifier  : 'email',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your e-mail'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid e-mail'
            }
          ]
        },
        password: {
          identifier  : 'password',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your password'
            },
            {
              type   : 'length[8]',
              prompt : 'Your password must be at least 8 characters'
            }
          ]
        }
      }
    },
    "#register-form": {
      fields: {
        fname: {
          identifier  : 'fname',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your firstname'
            },
          ]
        },
        lname: {
          identifier  : 'lname',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your lastname'
            },
          ]
        },
        email: {
          identifier  : 'email',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your e-mail'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid e-mail'
            }
          ]
        },
        password: {
          identifier  : 'password',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your password'
            },
            {
              type   : 'length[8]',
              prompt : 'Your password must be at least 8 characters'
            }
          ]
        },
        password_confirmation: {
          identifier  : 'password_confirmation',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your password confirmation'
            },
            {
              type   : 'match[password]',
              prompt : 'Your passwords do not match'
            }
          ]
        }
      }
    },
  };
  for (let i = 0; i < validationForms.length; i++) {
    var rules = validationRules[validationForms[i]];
    $(validationForms[i]).form(rules);
  }
});