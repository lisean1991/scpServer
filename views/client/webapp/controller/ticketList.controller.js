sap.ui.define([
	"ygsd/controller/BaseController",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("ygsd.controller.ticketList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ygsd.view.ticketDetail
		 */
			onInit: function() {
		      this.getRouter().getRoute("ticketList").attachPatternMatched(this._beforeShow, this);
			},

      _beforeShow:function(oEvent){
        var oData = oEvent.getParameters().arguments;
        this.oModel = new JSONModel();
        this.getView().setModel(this.oModel);
        this.getView().setBusy(true);
        this.callService("/c4c/getTickets","GET",{openId: this.getAccessInfo().openid},function(result){
          this.oModel.setData(result.ServiceRequest);
          this.getView().setBusy(false);
          //this.getView().byId("list").bindItems('/');
        }.bind(this),function(result){
          this.showMessage(result.responseText,"error");
          this.getView().setBusy(false);
        }.bind(this));
      },

      handlePress: function(e){
        var oData = e.getSource().getBindingContext().getObject();
        this.getRouter().navTo("ticketDetail", {srId:oData.ID}, false);
      },

			onNavBack:function(){
				this.navBack();
			}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});
