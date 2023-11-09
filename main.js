const TRACKING_SHEET_NAME = 'Tracking';

function startProcessingClaimSubmission(event){
  var trackingSheet = SpreadsheetApp.getActive().getSheetByName(TRACKING_SHEET_NAME);
  let executionFlow = (event == undefined || event == null) ? 'test' : 'production';
  let claimInfo;

  //build claim details out of submitted response values
  if(executionFlow == 'test'){
    claimInfo = sampleClaimInfo();
  } else {
    claimInfo = buildClaimDetails(event.values);
  }

  // generate trackingID from the tracking sheet
  var trackingID = generateUIDFromTrackingSheet(trackingSheet);

  // create a document for claim form and attach the link to the document
  const pdfFile = generatePDFForClaim(trackingID, claimInfo);
  const formURL = pdfFile.getUrl();

  const claimDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  // copy to the tracking sheet
  updateTrackingSheet(trackingSheet, trackingID, claimDate, claimInfo, formURL);

  // send an acknowledgement email
  sendAcknowledgementEmail(claimInfo, claimDate, trackingID, formURL);
}

function updateTrackingSheet(sheet, trackingID, claimDate, claimInfo, claimDocumentURL){
  sheet.appendRow([claimInfo['claimantEmail'], claimInfo['claimantName'], claimInfo['patientName'], claimInfo['totalAmount'], claimDate, trackingID, claimDocumentURL]);
}

function buildClaimDetails(responseValues){
  const claimInfo = {
    'claimantEmail': responseValues[1],
    'claimantName': responseValues[2],
    'claimantPhoneNumber': responseValues[3],
    'patientName': responseValues[4],
    'relationToDependent': responseValues[5],
    'illnessDetails': responseValues[6],
    'detailsOfDoctor': responseValues[7],
    'hospitalName': responseValues[8],
    'dateOfTreatment': responseValues[9],
    'diagnosisDetails': responseValues[10],
    'expensesDoctor': responseValues[11],
    'expensesPathology': responseValues[12],
    'expensesMedicine': responseValues[13],
    'expensesOperationTheatre': responseValues[14],
    'totalAmount': responseValues[15],
  };
  return claimInfo;
}

// function buildEmailContent(claimDate, claimInfo, trackingID, formURL){
//   var template = HtmlService.createTemplateFromFile('tracking-email');
//   template.claimDetails = claimInfo;
//   template.uid = trackingID;
//   template.claimDate = claimDate;
//   template.formURL = formURL;
//   var message = template.evaluate().getContent();
//   return message;
// }

// generate UID from tracking sheet
function generateUIDFromTrackingSheet(sheet){
  var lastTrackingID = getLastTrackingID(sheet);
  return parseInt(lastTrackingID) >= 0 ? parseInt(lastTrackingID) + 1 : 1;
}

function getLastTrackingID(sheet){
  var trackingIDCell = sheet.getLastRow() == 0 ? "F1" : `F${sheet.getLastRow()}`;
  return parseInt(sheet.getRange(trackingIDCell).getValue());
}
