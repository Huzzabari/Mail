document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // send mail
  // event listener for submit/send in compose view. prevents default event from a click and uses the send_mail function in the code below.
  document.querySelector('#send').addEventListener('click', (event) => {
    event.preventDefault();
    send_mail();
  });
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // fetch mailbox 
  fetch('/emails/' + mailbox)
    .then(response => response.json())
    .then(emails => {
      // store read view in read_list
      read_list = document.querySelector('#read-view');
      read_list.innerHTML = '';
      // clear out read list and then select emails-view
      email_list = document.querySelector("#emails-view")
      console.log(emails);
      // print emails
      // email loop where I create a div per email and add event listener to each
      for (let email of emails) {
        let div = document.createElement('div');
        div.addEventListener('click', function () {
          fetch('/emails/' + email.id)
            .then(response => response.json())
            .then(email => {
              // Print emails
              console.log(email);
              // fetch email when clicked on, and also changes it to have been read
              if (email.read == false) {
                fetch('/emails/' + email.id, {
                  method: 'PUT',
                  body: JSON.stringify({
                    read: true
                  })
                })
              }
              read_list = document.querySelector('#read-view');
              let div = document.createElement('div');
              div.className = "readDiv";
              // hides everything but read view and creates divs for each piece of data
              let senderDiv = document.createElement('div');
              let recipientDiv = document.createElement('div');
              let subjectDiv = document.createElement('div');
              let timestampDiv = document.createElement('div');
              let replyButton = document.createElement('button');
              let bodyDiv = document.createElement('p');
              let archiveButton = document.createElement('button');
              // puts the text and data into each div through .textContent and adds class names.
              senderDiv.textContent = "From: " + email.sender;
              recipientDiv.textContent = "To:" + email.recipients;
              subjectDiv.textContent = "Subject:" + email.subject;
              timestampDiv.textContent = "Timestamp:" + email.timestamp;
              replyButton.textContent = "Reply";
              replyButton.className = "reply";
              bodyDiv.textContent = email.body;
              bodyDiv.className = "email_body";
              // if email is not archived make button to archive it, else make button un-archive, also make classname archive
              if (email.archived == false) {
                archiveButton.textContent = "Archive";
                archiveButton.className = "archive";
              }
              else {
                archiveButton.textContent = "Un-Archive";
                archiveButton.className = "archive";
              }
              // onclick archive emails do a fetch request and make the change based on email.archived info
              archiveButton.addEventListener('click', function () {
                if (email.archived == false) {
                  fetch('/emails/' + email.id, {
                    method: 'PUT',
                    body: JSON.stringify({
                      archived: true
                    })
                  })
                    // then after that change is implemented wait and load mailbox
                    .then(response => {
                      if (response.ok) {
                        load_mailbox('inbox');
                      }
                    })
                }
                else {
                  fetch('/emails/' + email.id, {
                    method: 'PUT',
                    body: JSON.stringify({
                      archived: false
                    })
                  })
                    // then after that change is implemented wait and load mailbox
                    .then(response => {
                      if (response.ok) {
                        load_mailbox('inbox');
                      }
                    })
                }
              })
              replyButton.addEventListener('click', function () {
                document.querySelector('#emails-view').style.display = 'none';
                document.querySelector('#compose-view').style.display = 'block';
                document.querySelector('#read-view').style.display = 'none';
                // hiding and displaying views and then setting values in the compose fields.
                document.querySelector('#compose-recipients').value = email.recipients;
                if (email.subject.startsWith("Re:")){
                  document.querySelector('#compose-subject').value = email.subject;
                }
                // if subject starts with Re: then don't add Re:, otherwise add it.
                else{
                  document.querySelector('#compose-subject').value = "Re: "+email.subject;
                }
                document.querySelector('#compose-body').value = "On"+email.timestamp+" "+email.sender+ " wrote: " + email.body;
              })
              div.append(senderDiv, recipientDiv, subjectDiv, timestampDiv, replyButton, bodyDiv, archiveButton);
              read_list.append(div);
              // appends these divs to the first div, then appends that div to div with id of read-view that read_list selected.  So a list of emails appear.
              document.querySelector('#emails-view').style.display = 'none';
              document.querySelector('#compose-view').style.display = 'none';
              document.querySelector('#read-view').style.display = 'block';
            });
        });
        // If email is read then set the class of the main div to gray and then make a list of divs
        if (email.read == true) {
          div.className = "emailClassGrey";
          let senderDiv = document.createElement('div');
          senderDiv.textContent = "from: " + email.sender;
          let subjectDiv = document.createElement('div');
          subjectDiv.textContent = "subject: " + email.subject;
          let timestampDiv = document.createElement('div');
          timestampDiv.textContent = "timestamp: " + email.timestamp;
          div.append(senderDiv, subjectDiv, timestampDiv);
          email_list.append(div);
        }
        // Else email is not read then set the class of the main div to white and then make a list of divs
        else {
          div.className = "emailClassWhite";
          let senderDiv = document.createElement('div');
          senderDiv.textContent = "from: " + email.sender;
          let subjectDiv = document.createElement('div');
          subjectDiv.textContent = "subject: " + email.subject;
          let timestampDiv = document.createElement('div');
          timestampDiv.textContent = "timestamp: " + email.timestamp;
          div.append(senderDiv, subjectDiv, timestampDiv);
          email_list.append(div);
        }
      };
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// send mail
function send_mail() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(result => { console.log(result); })
    .then(() => load_mailbox('sent'));
}


