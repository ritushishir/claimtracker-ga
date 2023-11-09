const FINANCE_TEAM_ALLIASE = 'cfnepal.insurance@cloudfactory.com';

const BASE_DOCUMENT_ID = '1rQGbKhIGsE38iEnGGB9UkJGrPpMRB2V-q0SL1rnlIMY';

function generatePDFForClaim(trackingID, claimInfo){
  const document = createDocument(trackingID, claimInfo);
  const pdfFile = convertToPDF(document.getId(), null);
  const pdfFileId = pdfFile.getId();
  
  // give access to Finance team and the claimant
  giveAccessToClaimForm(pdfFileId, FINANCE_TEAM_ALLIASE, 'group', 'reader');
  giveAccessToClaimForm(pdfFileId, claimInfo['claimantEmail'], 'user', 'owner');

  // remove the tempory document
  DriveApp.getFileById(document.getId()).setTrashed(true);
  return pdfFile;
}

function createDocument(claimID, claimInfo){
  const claimantName = claimInfo['claimantName'];
  const documentName = `IC-${claimID}-${claimantName}`;
  const templateFile = DriveApp.getFileById(BASE_DOCUMENT_ID);
  const newDocument = templateFile.makeCopy();
  newDocument.setName(documentName);
  const document = DocumentApp.openById(newDocument.getId());

  const boldStyle = {}
  boldStyle[DocumentApp.Attribute.BOLD] = true;
  boldStyle[DocumentApp.Attribute.PADDING_LEFT] = 2;
  boldStyle[DocumentApp.Attribute.PADDING_TOP] = 2;
  boldStyle[DocumentApp.Attribute.PADDING_BOTTOM] = 2;

  const body = document.getBody();
  const mainTable = body.getTables()[0];
  const expenseTable = body.getTables()[1];
  mainTable.getRow(1).getCell(5).setText(claimID).setAttributes(boldStyle);
  mainTable.getRow(2).getCell(1).setText(buildPersonalDetails(claimInfo)).setAttributes(boldStyle);
  mainTable.getRow(3).getCell(1).setText(buildDependentDetails(claimInfo)).setAttributes(boldStyle);
  mainTable.getRow(4).getCell(1).setText(claimInfo['dateOfTreatment']).setAttributes(boldStyle);
  mainTable.getRow(5).getCell(1).setText(claimInfo['illnessDetails']).setAttributes(boldStyle);
  mainTable.getRow(6).getCell(1).setText(claimInfo['detailsOfDoctor']).setAttributes(boldStyle);
  mainTable.getRow(7).getCell(1).setText(claimInfo['hospitalName']).setAttributes(boldStyle);

  const style = {}
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.PADDING_LEFT] = 2;
  style[DocumentApp.Attribute.PADDING_TOP] = 2;
  style[DocumentApp.Attribute.PADDING_BOTTOM] = 2;
  expenseTable.getRow(1).getCell(1).setText(claimInfo['expensesDoctor']).setAttributes(style);
  expenseTable.getRow(2).getCell(1).setText(claimInfo['expensesPathology']).setAttributes(style);
  expenseTable.getRow(3).getCell(1).setText(claimInfo['expensesMedicine']).setAttributes(style);
  expenseTable.getRow(4).getCell(1).setText(claimInfo['expensesOperationTheatre']).setAttributes(style);
  expenseTable.getRow(5).getCell(1).setText(computeTotal(claimInfo)).setAttributes(style);

  document.saveAndClose();

  return document;
}

function computeTotal(claimInfo){
  // return parseInt(claimInfo['expensesDoctor']) + parseInt(claimInfo['expensesPathology']) + parseInt(claimInfo['expensesMedicine']) + parseInt(claimInfo['expensesOperationTheatre']);
  return claimInfo['totalAmount'];
}

function buildFileName(claimID, claimInfo){
  return `Claim-#${claimID}-${claimInfo['claimantName']}-${claimInfo['dateOfTreatment']}`;
}

function buildPersonalDetails(claimInfo){
  let personalDetails = `${claimInfo['claimantName']}\tE: ${claimInfo['claimantEmail']}\tPh: ${claimInfo['claimantPhoneNumber']}`;
  // if(claimInfo['claimantPhoneNumber'] != ''){
  //   personalDetails += `/${claimInfo['claimantPhoneNumber']}`;
  // }
  return personalDetails;
}

function buildDependentDetails(claimInfo){
  return `${claimInfo['patientName']} \t(${claimInfo['relationToDependent']})`;
}

function convertToPDF(documentID, folderID = null){
  const document = DocumentApp.openById(documentID);
  let pdfFile = null;
  const pdfContent = document.getAs('application/pdf');
  if(folderID != null && folderID != undefined){
    const folder = DriveApp.getFolderById(folderID);
    pdfFile = folder.createFile(document.getAs('application/pdf'));
  } else  {
    pdfFile = DriveApp.createFile(document.getAs('application/pdf'));
  }
  return pdfFile;
}

// https://developers.google.com/drive/api/reference/rest/v2/permissions
function giveAccessToClaimForm(fileId, email, type, role){
  try{
    Drive.Permissions.insert(
    {
      'role': role,
      'type': type,
      'value': email
    },
    fileId,
    {
      'sendNotificationEmails': 'false'
    }
  );
  } catch(error){
    console.log('Processing ', email);
    console.log('Error in updating permissions', error);
  }
}
