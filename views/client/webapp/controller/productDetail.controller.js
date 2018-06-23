sap.ui.define([
  "ygsd/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History"
], function(Controller, JSONModel, History) {
  "use strict";

  return Controller.extend("ygsd.controller.productDetail", {
    onInit: function() {
      this.getRouter().getRoute("productDetail").attachPatternMatched(this.onRead, this);
    },

    onRead: function(oEvent) {
      var sSerialID = oEvent.getParameter("arguments").serialID;
      var sProductID = oEvent.getParameter("arguments").productID;
      var oRequest = {
        url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/cust/v1/",
        filter: "SerialID eq \'" + sSerialID + "\' and ProductID eq \'" + sProductID + "\'" + "&$expand=MeasurementPoint&sap-language=EN",
        collection: "RegisteredProductCollection",
        service: "zregisteredproduct"
      };
      this.getView().setBusy(true);
      this.callService("/read", "GET", oRequest, jQuery.proxy(this.submitSuccess,this), jQuery.proxy(this.submitError,this));
    },

    submitSuccess:function(result){
      var oModel = new JSONModel(result[0]);
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
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("productSearch", {}, true);
			}
		},

    onItemPress: function (oEvent) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var oItem = oEvent.getSource();
      oRouter.navTo("measurementDoc", {ID: oItem.getBindingContext().getProperty("ID")});
    }

  });
});
