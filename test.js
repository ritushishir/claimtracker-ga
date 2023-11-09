function testFlow(){
  // var trackingSheet = SpreadsheetApp.getActive().getSheetByName(TRACKING_SHEET_NAME);
  const claimInfo = sampleClaimInfo();
  // const uID = generateUIDFromTrackingSheet(trackingSheet);
  const pdfFile = generatePDFForClaim(1, claimInfo);
  console.log(pdfFile.getUrl());
}

function sampleClaimInfo(){
  return {
    'claimantEmail': 'shishir@cloudfactory.com',
    'claimantName': 'Shishir Paudyal',
    'claimantPhoneNumber': '9851152776',
    'patientName': 'Sharahana Paudyal',
    'relationToDependent': 'Daughter',
    'illnessDetails': 'Fever',
    'detailsOfDoctor': 'Dr. CN Shah / NMC - 15078',
    'hospitalName': 'Kshitiz Medical Centre, Kumari Club, Balkhu',
    'dateOfTreatment': '2023-10-30',
    'diagnosisDetails': 'Allergy/Common Cold',
    'expensesDoctor': '600',
    'expensesPathology': '',
    'expensesMedicine': '100',
    'expensesOperationTheatre': '',
    'totalAmount': 700,
  };
}

function testA(){
  const link = "https://drive.google.com/file/d/1UWPszvUUuUv67R5x5ClATCJ3Nb2_6DVJ/view?usp=drivesdk";
  const file = DriveApp.getFileById('1qb4Z_5Vz4pZqX_cYwuCToOWQKdiGf-mx4xHLtlhYLRM');
  // file.addViewer('shishir@cloudfactory.com');

  Drive.Permissions.insert(
   {
     'role': 'reader',
     'type': 'user',
     'value': 'bhim@cloudfactory.com'
   },
   file.getId(),
   {
     'sendNotificationEmails': 'false'
   });

}
