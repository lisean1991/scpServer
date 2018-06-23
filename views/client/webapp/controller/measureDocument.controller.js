sap.ui.define([
  "ygsd/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History"
], function(Controller, JSONModel, History) {
  "use strict";

  return Controller.extend("ygsd.controller.measureDocument", {
    onInit: function() {
      this.getRouter().getRoute("measurementDoc").attachPatternMatched(this.onRead, this);
    },

    onRead: function(oEvent) {
      this.pointID = oEvent.getParameter("arguments").ID;
      var oRequest = {
        url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/cust/v1/",
        filter: "ID1 eq \'" + this.pointID + "\'" + "&sap-language=EN",
        collection: "MeasurementDocumentCollection",
        service: "zregisteredproduct"
      };
      this.getView().setBusy(true);
      this.callService("/read", "GET", oRequest, jQuery.proxy(this.submitSuccess,this), jQuery.proxy(this.submitError,this));
    },

    submitSuccess:function(result){
      var oModel = new JSONModel(result);
      for(var i=0; i<oModel.getData().length;i++) {
        oModel.getData()[i].formatedDateTime = new Date(parseInt(oModel.getData()[i].MeasuredDateTime.replace("/Date(","").replace(")/","")));
      }
      this.getView().setModel(oModel);
      this.getView().setBusy(false);
    },

    submitError:function(result){
      this.getView().setBusy(false);
      this.showMessage(result.responseText,"error");
    },

    onNavBack: function () {
      var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
    },

    onNew: function (oEvent) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("measurementCreate", {ID: this.pointID});
    }

  });
});
