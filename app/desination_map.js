const DESTINATION_MAP = {
 "localhost": {
      "Name": "c4c",
      "Type": "HTTP",
      "URL": "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/",
      "Authentication": "BasicAuthentication",
      "ProxyType": "Internet",
      "Description": "c4c retrive data",
      "User": "crmops",
      "Password": "Ondemand1"
  }
};

function getProperty(nema){
  return DESTINATION_MAP[nema];
};

function setProperty(nema,key,value){
  DESTINATION_MAP[nema][key] = value;
};

function setDest(nema,value){
  DESTINATION_MAP[nema] = value;
};

function getAll(){
  return DESTINATION_MAP;
};

exports.getProperty= getProperty;
exports.setProperty= setProperty;
exports.setDest= setDest;
exports.getAll= getAll;
