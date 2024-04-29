document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // send mail
  document.querySelector('#send').addEventListener('click', (event) => {
    console.log("clicked");
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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // fetch mailbox 
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    email_list=document.querySelector("#emails-view")             // NOT DONE.  JUST WHAT I'M TRYING OUT
    console.log(emails);
      for (let email of emails){
        let div=document.createElement('div');
        if (email.read==true){
          div.className="emailClassGrey";

        let senderDiv = document.createElement('div');
        senderDiv.textContent = "from: " + email.sender;
       
        let subjectDiv = document.createElement('div');
        subjectDiv.textContent = "subject: " + email.subject;


        let timestampDiv = document.createElement('div');
        timestampDiv.textContent = "timestamp: " + email.timestamp;
        
        div.append(senderDiv, subjectDiv, timestampDiv);
        email_list.append(div);
        }
        else{
          div.className="emailClassWhite";

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
function send_mail(){
  console.log("send_mail function called");
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients:  document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {console.log(result);})
  .then(() => load_mailbox('sent'));
}


