function onOpen(){
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('CloudFactory Menu');
  menu.addItem('Send Update Email', 'sendEmailUpdate').addToUi();
}

// sends update email for selected row
// function sendEmailUpdate(){
//   const spreadSheet = SpreadsheetApp.getActive().getSheetByName(TRACKING_SHEET_NAME);

//   const selectedRowValues = spreadSheet.getActiveRangeList().getRanges()[0].getValues()[0];

//   const claimDetails = {
//     'claimantName': selectedRowValues[0],
//     'claimantEmail': selectedRowValues[1],
//     'patientName': selectedRowValues[2],
//     'claimAmount':selectedRowValues[3],
//     'claimDate': selectedRowValues[4],
//     'trackingID': selectedRowValues[5],
//     'formURL': selectedRowValues[6],
//     'status': selectedRowValues[7],
//     'remarks': selectedRowValues[8],
//     'nextStep': selectedRowValues[9],
//     'signedDate': selectedRowValues[10],
//     'settlementAmount': selectedRowValues[11],
//   }
  
//   const updateEmailBody = buildUpdateEmailContent(claimDetails);
//   const claimantEmail = claimDetails['claimantEmail'];
//   const claimantName = claimDetails['claimantName'];
//   var emailSubject = `Update - Insurance Claim# ${claimDetails['trackingID']} - ${claimDetails['patientName']}`;
//   MailApp.sendEmail({
//     to: claimantEmail, 
//     subject: emailSubject, 
//     htmlBody: updateEmailBody
//   });
//   SpreadsheetApp.getUi().alert(`Sent Email to ${claimantName} - ${claimantEmail}`);
// }

// function buildUpdateEmailContent(claimDetails){
//   var template = HtmlService.createTemplateFromFile('update-email');
//   template.claimDetails = claimDetails;
//   var message = template.evaluate().getContent();
//   return message;
// }
