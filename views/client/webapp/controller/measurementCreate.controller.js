sap.ui.define([
  "ygsd/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History"
], function(Controller, JSONModel, History) {
  "use strict";

  return Controller.extend("ygsd.controller.measurementCreate", {
    onInit: function () {
      this.getRouter().getRoute("measurementCreate").attachPatternMatched(function(oEvent) {
        this.pointID = oEvent.getParameter("arguments").ID;
      }, this);

      this.oModel = new JSONModel({
        value: "",
        description: ""
      }, true);

      this.getView().setModel(this.oModel);
    },

    onCancel: function () {
      var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
    },

    onSave: function () {
      var oData = this.oModel.getData();
      var oRequest = {
        url: "https://my306768.vlab.sapbydesign.com/sap/c4c/zwcint",
        id: this.pointID,
        value: oData.value,
        description: oData.description,
        measuredOn: oData.measuredOn.toISOString()
      };
      this.callService("/modify", "GET", oRequest, jQuery.proxy(this.submitSuccess,this), jQuery.proxy(this.submitError,this));
      this.getView().setBusy(true);
    },

    submitSuccess: function (oResult) {
      this.getView().setBusy(false);
      this.navBack();
    },

    submitError: function (oResult) {
      this.getView().setBusy(false);
    },

    navBack: function () {
      var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("productDetail", {}, true);
			}
    },

    onDateChange: function(oEvent) {
      var oDTP = oEvent.oSource;
      var bValid = oEvent.getParameter("valid");
      if (bValid) {
				oDTP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDTP.setValueState(sap.ui.core.ValueState.Error);
			}
    }

  });
});
