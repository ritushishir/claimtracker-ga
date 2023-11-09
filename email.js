// sends update email for selected row
function sendEmailUpdate(){
  const spreadSheet = SpreadsheetApp.getActive().getSheetByName(TRACKING_SHEET_NAME);

  const selectedRowValues = spreadSheet.getActiveRangeList().getRanges()[0].getValues()[0];

  const claimDetails = {
    'claimantEmail': selectedRowValues[0],
    'claimantName': selectedRowValues[1],
    'patientName': selectedRowValues[2],
    'claimAmount':selectedRowValues[3],
    'claimDate': selectedRowValues[4],
    'trackingID': selectedRowValues[5],
    'status': selectedRowValues[8],
    'remarks': selectedRowValues[9],
    'nextStep': selectedRowValues[10],
    'signedDate': selectedRowValues[11],
    'settlementAmount': selectedRowValues[12],
    'depositedOn': selectedRowValues[13]
  }
  
  const updateEmailBody = buildUpdateEmailContent(claimDetails);
  const claimantEmail = claimDetails['claimantEmail'];
  const claimantName = claimDetails['claimantName'];
  var emailSubject = `Update - Insurance Claim# ${claimDetails['trackingID']} - ${claimDetails['patientName']}`;
  MailApp.sendEmail({
    to: claimantEmail, 
    subject: emailSubject, 
    htmlBody: updateEmailBody
  });
  SpreadsheetApp.getUi().alert(`Update email sent to ${claimantName} - ${claimantEmail}`);
}

function buildUpdateEmailContent(claimDetails){
  var template = HtmlService.createTemplateFromFile('update-email');
  template.claimDetails = claimDetails;
  var message = template.evaluate().getContent();
  return message;
}

function sendAcknowledgementEmail(claimInfo, claimDate, trackingID, formURL){
	const claimantEmail = claimInfo['claimantEmail'];
	const dependentName = claimInfo['patientName'];
	const emailBody = buildEmailContent(claimDate, claimInfo, trackingID, formURL);
	const emailSubject = `Insurance Claim# ${trackingID} - ${dependentName}`;
	// MailApp.sendEmail({
	// 	to: claimantEmail, 
	// 	subject: emailSubject,
	// 	htmlBody: emailBody
	// });
  MailApp.sendEmail(claimantEmail, emailSubject, emailBody, { cc: 'bhim@cloudfactory.com', htmlBody: emailBody });
}
	
function buildEmailContent(claimDate, claimInfo, trackingID, formURL){
	var template = HtmlService.createTemplateFromFile('tracking-email');
	template.claimDetails = claimInfo;
	template.uid = trackingID;
	template.claimDate = claimDate;
	template.formURL = formURL;
	var message = template.evaluate().getContent();
	return message;
}
	