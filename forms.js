/* OMRC — form submission
   Both site forms post to Web3Forms and share the same lifecycle: validate,
   lock the button, send, report the outcome. Each page supplies only what
   differs — its validation, busy label, and messages. */
(function () {
  'use strict';

  var ENDPOINT = 'https://api.web3forms.com/submit';

  function wireForm(options) {
    var form = document.getElementById(options.formId);
    var status = document.getElementById(options.statusId);
    if (!form || !status) return;

    var button = form.querySelector('button[type="submit"]');
    var idleLabel = button.textContent;

    function show(message, isError) {
      status.textContent = message;
      status.classList.add('is-visible');
      status.classList.toggle('is-error', Boolean(isError));
      if (options.scrollToStatus) {
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      var problem = options.validate(form);
      if (problem) {
        show(problem, true);
        return;
      }
      if (options.beforeSend) options.beforeSend(form);

      button.disabled = true;
      button.textContent = options.busyLabel;
      status.classList.remove('is-visible');

      try {
        var response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        var result = await response.json();

        if (result.success) {
          show(options.successMessage(form), false);
          form.reset();
        } else {
          show(options.failureMessage, true);
        }
      } catch (error) {
        show(options.networkMessage, true);
      } finally {
        button.disabled = false;
        button.textContent = idleLabel;
      }
    });
  }

  function value(form, id) {
    return form.querySelector('#' + id).value.trim();
  }

  /* The form is novalidate so it can show its own messages, which also
     switches off the browser's type="email" check; ask the input directly. */
  function isValidEmail(form, id) {
    var input = form.querySelector('#' + id);
    return input.value.trim() !== '' && input.validity.valid;
  }

  /* <input type="date"> yields "yyyy-mm-dd". new Date() parses that string as
     UTC midnight, which in the Americas is the previous evening locally and
     would admit an applicant one day before their eighteenth birthday.
     Build the date from its parts so it is local midnight instead. */
  function isAtLeast(years, isoDate) {
    var parts = isoDate.split('-').map(Number);
    var threshold = new Date(parts[0] + years, parts[1] - 1, parts[2]);
    return new Date() >= threshold;
  }

  wireForm({
    formId: 'contact-form',
    statusId: 'contact-status',
    busyLabel: 'Sending...',
    validate: function (form) {
      if (!value(form, 'name') || !value(form, 'message')) {
        return 'Please provide your name, email address, and a message before sending.';
      }
      if (!isValidEmail(form, 'email')) {
        return 'Please provide a valid email address so that we can reply.';
      }
      return null;
    },
    successMessage: function () {
      return 'Deo gratias. Thank you for reaching out to the Ordo Militantium Reginae Caeli. We will be in touch shortly. Sub tuum Praesidium.';
    },
    failureMessage: 'Your message could not be sent. Please try again, or write to us directly.',
    networkMessage: 'Your message could not be sent. Please check your connection and try again.'
  });

  wireForm({
    formId: 'apply-form',
    statusId: 'apply-status',
    busyLabel: 'Submitting...',
    scrollToStatus: true,
    validate: function (form) {
      var dob = form.querySelector('#dob').value;

      if (!value(form, 'fname')) {
        return 'Please fill in your name and email address before submitting.';
      }
      if (!isValidEmail(form, 'email')) {
        return 'Please provide a valid email address so that we can contact you.';
      }
      if (dob && !isAtLeast(18, dob)) {
        return 'We regret that applicants must be at least 18 years of age to join the Order.';
      }
      if (!form.querySelector('#check-catholic').checked) {
        return 'Membership in the Ordo Militantium Reginae Caeli is open to practicing Catholics only. Please confirm your faith before submitting.';
      }
      if (!form.querySelector('#check-age').checked) {
        return 'Please confirm that you are at least 18 years of age.';
      }
      if (!form.querySelector('#check-truth').checked) {
        return 'Please confirm that your information is accurate before submitting.';
      }
      return null;
    },
    beforeSend: function (form) {
      form.querySelector('#affirmations').value =
        'Practicing Catholic: yes | 18 or older: yes | Information affirmed true: yes';
    },
    successMessage: function (form) {
      return 'Ad Majorem Dei Gloriam. Thank you, ' + value(form, 'fname') +
        '. Your application has been received and will be reviewed by the Custos Generalis. ' +
        'You will be contacted at the email address provided. Sub tuum Praesidium.';
    },
    failureMessage: 'Your application could not be submitted. Please try again, or contact us directly.',
    networkMessage: 'Your application could not be submitted. Please check your connection and try again.'
  });
})();
