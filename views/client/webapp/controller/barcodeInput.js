sap.ui.define([
	'sap/m/Input',
	'sap/m/InputRenderer',
  'sap/ui/core/IconPool'
], function(Input, InputRenderer,IconPool) {
	"use strict";


	return Input.extend("ygsd.controller.barcodeInput", {
		metadata: {
			properties: {
				'custRequired': { // Custom Required property, UI5 doesnt support this (use unique name, ui5 might add this in future)
					type: "boolean",
					defaultValue: false,
					group: "Appearance"
				},
				"showBarcode": { type: "boolean", group: "Behavior", defaultValue: false },
				"wrapper": {
					type: "object"
				}
			},
			aggregations: {
				'_barcodeIcon': { type: "sap.ui.core.Icon", multiple: false, visibility: "hidden" }
			},
			events: {
				"barcodeScan": {}
			}
		},

		_getBarcodeIcon: function() {
			var that = this,
				_oBarcodeIcon = this.getAggregation("_barcodeIcon"),
				sURI;

			if (_oBarcodeIcon) {
				return _oBarcodeIcon;
			}

			sURI = IconPool.getIconURI("bar-code");
			_oBarcodeIcon = IconPool.createControlByURI({
				id: this.getId() + "-bci",
				src: sURI,
				useIconTooltip: false,
				noTabStop: true
			});

			_oBarcodeIcon.addStyleClass("sapMInputValHelpInner");
			_oBarcodeIcon.attachPress(function(evt) {
				this.getParent().focus();
				that.fireBarcodeScan({ fromSuggestions: false });
			});

			this.setAggregation("_barcodeIcon", _oBarcodeIcon);

			return _oBarcodeIcon;
		},

		renderer: InputRenderer.extend("ygsd.InputFieldRenderer", {
			writeDecorations: function(oRm, oControl) {

				var id = oControl.getId(),
					description = oControl.getDescription();

				if (!description) {
					this.writeBarcodeScanIcon(oRm, oControl);
					this.writeValueHelpIcon(oRm, oControl);
				} else {
					oRm.write("<span>");
					this.writeBarcodeScanIcon(oRm, oControl);
					this.writeValueHelpIcon(oRm, oControl);
					oRm.write('<span id="' + oControl.getId() + '-Descr" class="sapMInputDescriptionText">');
					oRm.writeEscaped(description);
					oRm.write("</span></span>");
				}

				if (sap.ui.getCore().getConfiguration().getAccessibility()) {
					if (oControl.getShowSuggestion() && oControl.getEnabled() && oControl.getEditable()) {
						oRm.write("<span id=\"" + id + "-SuggDescr\" class=\"sapUiPseudoInvisibleText\" role=\"status\" aria-live=\"polite\"></span>");
					}
				}
			},

			writeBarcodeScanIcon: function(oRm, oControl) {

					oRm.write('<div class="sapMInputValHelp barcode" tabindex="-1">');
					oRm.renderControl(oControl._getBarcodeIcon());
					oRm.write("</div>");

			},

			addOuterClasses: function(oRm, oControl) {
				oRm.addClass("sapMInput");
				if (oControl.getEnabled() && oControl.getEditable()) {
					if (oControl.getShowValueHelp() && oControl.getShowBarcode()) {
						oRm.addClass("sapMInputVHBR");
						if (oControl.getValueHelpOnly()) {
							oRm.addClass("sapMInputVHO");
						}
					} else if (oControl.getShowValueHelp() || oControl.getShowBarcode()) {
						oRm.addClass("sapMInputVH");
						if (oControl.getValueHelpOnly()) {
							oRm.addClass("sapMInputVHO");
						}
					}

				}
				if (oControl.getDescription()) {
					oRm.addClass("sapMInputDescription");
				}
			}
		})
		// renderer: function(oRm, oControl) {
		// oControl.setProperty("editable", oControl.getEditable() && oControl.getCustNotReadOnly(), true);
		// sap.m.InputRenderer.render(oRm, oControl);
		// }
	});


}, /* bExport= */ true);
