
var jpdbBaseUrl = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var projDBName = 'Project-DB';
var projRelationName = 'ProjData';
var connToken = '90938151|-31949272997338162|90955135';



function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getProjIdAsJsonObj() {

    var projId = $('#projId').val();
    var jsonStr = {
        projId: projId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#projName').val(record.projName);
    $('#assnTo').val(record.assnTo);
    $('#assnDate').val(record.assnDate);
    $("#deadline").val(record.deadline);
}

function validateAndGetFormData() {
    var projId = $("#projId").val();
    if (projId === "") {
        alert("Project ID Required Value");
        $("#projId").focus();
        return "";
    }
    var projName = $("#projName").val();
    if (projName === "") {
        alert("Project Name is Required Value");
        $("#projName").focus();
        return "";
    }
    var assnTo = $("#assnTo").val();
    if (assnTo === "") {
        alert("Project Assigned-To is Required Value");
        $("#assnTo").focus();
        return "";
    }
    var assnDate = $("#assnDate").val();
    if (assnDate === "") {
        alert("Project Assigned Date is Required Value");
        $("#assnDate").focus();
        return "";
    }
    var deadline = $("#deadline").val();
    if (deadline === "") {
        alert("Project Deadline is Required Value");
        $("#deadline").focus();
        return "";
    }
    var jsonStrObj = {
        projId: projId,
        projName: projName,
        assnTo: assnTo,
        assnDate: assnDate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#projId").val("");
    $("#projName").val("");
    $("#assnTo").val("");
    $("#assnDate").val("");
    $("#deadline").val("");
    $("#projId").prop("disabled", false);
    $("#projSave").prop("disabled", true);
    $("#projUpdate").prop("disabled", true);
    $("#projReset").prop("disabled", true);
    $("#projId").focus();
}
function saveProject() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
//    var putReqStr = createPUTRequest("90938151|-31949272997338162|90955135",
//            jsonStr, "SAMPLE", "EMP-REL");
    var putReqStr = createPUTRequest(connToken, jsonStr, projDBName, projRelationName);
//    alert(putReqStr);
    jQuery.ajaxSetup({async: false});
//    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,"http://api.login2explore.com:5577", "/api/iml");
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseUrl, jpdbIML);
//    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#projId").focus();
}

function updateProject() {

    $('#projUpdate').prop("disabled", true);
    jsonUpd = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonUpd, projDBName, projRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();

    $('#projId').focus();
}

function getProj() {
    var projIdJsonObj = getProjIdAsJsonObj();
    getRequest = createGET_BY_KEYRequest(connToken, projDBName, projRelationName, projIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#projSave").prop("disabled", false);
        $("#projReset").prop("disabled", false);
        $("#projName").prop("disabled", false);
        $("#assnTo").prop("disabled", false);
        $("#assnDate").prop("disabled", false);
        $("#deadline").prop("disabled", false);
        $("#projName").focus();
    } else if (resJsonObj.status === 200) {
        $("#projId").prop("disabled", true);
        fillData(resJsonObj);
        $("#projUpdate").prop("disabled", false);
        $("#projReset").prop("disabled", false);
        $("#projName").focus();
    }
}
