var oHandleC4CRequest = require(process.cwd() + '/app/controllers/handleC4CRequest.js');
var handleC4CRequest = new oHandleC4CRequest();
function miniProgram (){

  this.getAppointment = function(oData,count,res){
    var iCount = count?count*10:0;
    var filter = "Owner/content eq \'" +oData.role_name +"\'&$orderby=CreatedOn desc&$top=20";//&$skip="+iCount+"&$top=10";
    handleC4CRequest.getDataFromC4C(filter,{collection:"AppointmentCollection"}).then(function(results){
      res.send({"appointments":results});
    }).catch(function(){
      res.send({"appointments":[]});
    });
  };

  this.getOpportunity = function(oData,count,res){
    var iCount = count?count*10:0;
    var filter = "OwnerName/content eq \'*\'&$orderby=CreatedOn desc&$skip="+iCount+"&$top=20";
    handleC4CRequest.getDataFromC4C(filter,{collection:"OpportunityCollection"}).then(function(results){
      res.send({"opportunities":results});
    }).catch(function(){
      res.send({"opportunities":[]});
    });
  };

  this.postOpportunity = function(req,res){
    handleC4CRequest.createOpportunity(req.body).then(function(result){
      res.send(result);
    }).catch(function(){
        res.send({"result":"error"});
      });
  };

  this.postEmployee = function(req,res){
    var oData = req.body;
    handleC4CRequest.assignEmployee(oData.openId,oData.employeeId).then(
      function(){
          res.send({"result":"success"});
        }).catch(
      function(){
          res.send({"result":"error"});
        });
  };

}
module.exports = miniProgram;
