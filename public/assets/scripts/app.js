let modalTools = {
	bypassOnHide: false,
	bypassOnHidden: false,
	modalInitHtml: '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><span class="font-weight-bold modal-title-cont"></span></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button></div><div class="modal-body"></div><div class="modal-footer"></div></div></div>',
	modalSMInitHtml: '<div class="modal-dialog modal-dialog-centered modal-sm"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><span class="font-weight-bold modal-title-cont"></span></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button></div><div class="modal-body"></div></div></div>',
	modalLGInitHtml: '<div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><span class="font-weight-bold modal-title-cont"></span></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button></div><div class="modal-body"></div><div class="modal-footer"></div></div></div>',
	modalFULLInitHtml: '<div class="modal-dialog modal-dialog-centered modal-xl"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><span class="font-weight-bold modal-title-cont"></span></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button></div><div class="modal-body"></div></div></div>',
	modalCreate: function(container,options){
		var modalInitHtml = this.modalInitHtml;
		if (typeof options === "undefined") options = {};
		if (typeof options.modal_size !== "undefined"){
			if (options.modal_size === 'lg') modalInitHtml = this.modalLGInitHtml;
			else if (options.modal_size === 'full') modalInitHtml = this.modalFULLInitHtml;
			else if (options.modal_size === 'sm') modalInitHtml = this.modalSMInitHtml;
		}
		let modal = $('<div/>').addClass('modal fade')
			.attr('role','basic')
			.attr('aria-hidden','true')
			.html(modalInitHtml)
			.on('hidden.bs.modal',function(){
				if (typeof options !== "undefined" && typeof options.onHidden === "function" && modalTools.bypassOnHidden === false) {
					options.onHidden();
				} else {
					modalTools.bypassOnHidden = false;
					$(this).remove();
				}
			})
			.on('hide.bs.modal',function(){
				if (typeof options !== "undefined" && typeof options.onHide === "function" && modalTools.bypassOnHide === false) {
					return options.onHide();
				} else {
					modalTools.bypassOnHide = false;
					return true;
				}
			})
			.on('shown.bs.modal',function(){
				if (typeof options !== "undefined" && typeof options.onShown === "function") {
					return options.onShown();
				}
			})
			.appendTo(container);
		if (typeof options.closable !== "undefined" && !options.closable){
			modal.attr('data-backdrop','static')
				.attr('data-keyboard','false')
				.find('.modal-header button.close').remove();
		}
		if (options.hasOwnProperty('noFooter') && options.noFooter){
			modal.find('.modal-footer').remove();
		}
		return modal;
	},
	modalUnbind: function(modal,event){
		switch (event) {
			case 'onHide':
				console.log(event);
				if (modalTools.bypassOnHide === false) {
					modal.unbind('hide.bs.modal');
				} else {
					modalTools.bypassOnHide = false;
					return true;
				}
				break;
		}
	},
	modalSetTitle: function(modal,title){
		modal.find('.modal-title-cont').html(title);
	},
	modalGetBody: function(modal){
		return modal.find('.modal-body')
	},
	modalSetBody: function(modal,bodyHtml){
		modal.find('.modal-body').html(bodyHtml);
	},
	modalGetFooter: function(modal){
		return modal.find('.modal-footer')
	},
	modalSetFooter: function(modal,footerHtml){
		modal.find('.modal-footer').html(footerHtml);
	},
	modalShow: function(modal){
		modal.modal('show');
	},
	modalHide: function(modal){
		modal.modal('hide');
	},
	modalDestroy: function(modal,bypassOnHide){
		if (typeof bypassOnHide !== "undefined") modalTools.bypassOnHide = bypassOnHide;
		else modalTools.bypassOnHide = false;
		modalTools.modalHide(modal);
	}
};

let formTools = {
	formCreate: function(target,classes,validate,submitMethod){
		var form = $('<form/>').attr('action','#').appendTo(target)
		if (!validate) form[0].noValidate = true;
		if (typeof classes !== "undefined") form.addClass(classes);
		form.submit(function(e){
			// if (typeof submitMethod === "function") submitMethod(e);
			e.preventDefault();
			var data = formTools.formValidate($(this));
			if (typeof submitMethod === "function") submitMethod(data);
			else $(this).submit();
		});
		this.showSpinner(form);
		return form;
	},
	init: function(form){
		form.html('');
		$('<div/>').addClass('form-fields').appendTo(form);
		$('<div/>').addClass('msg-cont form-group').html('<div class="row"><div class="col-md-2"></div><div class="col-md-10 alerts-cont"><div class="alert display-none"></div></div></div>').appendTo(form);
		$('<div/>').addClass('form-action-buttons').html('<div class="row buttons-cont"><div class="col-md-2"></div><div class="col-md-10 buttons-cont-inner"></div></div>').appendTo(form);
	},
	showSpinner: function(form){
		this.init(form);
		this.messageDiv('table-search-spinner font-green','text-align: center;','<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>',form);
	},
	messageDiv: function(classes,css,html,form){
		$('<div/>')
			.addClass(classes)
			.attr('style',css)
			.html(html)
			.appendTo(formTools.formGetFieldsCont(form));
	},
	formGetFieldsCont: function(form){
		return form.find('.form-fields');
	},
	formPopulate: function(form,fields,buttons,callBack){
		this.init(form);
		$.each(fields,function (fKey, field) {
			formTools.formFieldAdd(form,field);
		});

		if (buttons.length) {
			var buttonsCont = formTools.formGetButtonsCont(form);
			$.each(buttons, function (bKey, button) {
				$('<button/>')
					.addClass(button.classes)
					.html(button.title)
					.click(function (e) {
						e.preventDefault();
						if (typeof button.clickAction === 'function') button.clickAction($(this));
					})
					.appendTo(buttonsCont);
			});
		}

		if (typeof callBack === "function") callBack();
	},
	formFieldAdd: function(form,field,addAfter,fieldHighlight){
		if (form.find('[name="'+field.name+'"]').length === 0) {
			var validate = form.data('validate');
			var noLabelFieldTypes = ['checkbox'];
			form = form.find('.form-fields');
			if (field.type === 'hidden') {
				if (typeof field.value === "object") {
					$.each(field.value,function(vKey,vVal){
						$('<input/>').attr('type', 'hidden').attr('name', field.name+'[]').val(vVal).appendTo(form);
					});
				} else $('<input/>').attr('type', 'hidden').attr('name', field.name).val(field.value).appendTo(form);
			} else {
				var formGroup = $('<div/>').addClass('row mb-3');
				if (typeof addAfter === "undefined") formGroup.appendTo(form);
				else if (addAfter === 'top') formGroup.prependTo(form);
				else form.find('[name="'+addAfter+'"]').closest('.form-group').after(formGroup);
				var fieldLabel = field.title;
				if (field.required) fieldLabel = fieldLabel + ' <span class="required">*</span>';
				if ($.inArray(field.type,noLabelFieldTypes) === -1) $('<label/>').attr('for',field.name).addClass('control-label col-md-2').html(fieldLabel).appendTo(formGroup);
				else $('<div/>').addClass('col-md-2').appendTo(formGroup);
				var inputCont = $('<div/>').addClass('col-md-' + field.cols).appendTo(formGroup);
				if (typeof field.instructions_html !== "undefined" && field.instructions_html !== '') $('<div/>').addClass('field-instructions-html').html(field.instructions_html).appendTo(inputCont);
				switch (field.type) {
					case 'file':
						$('<input/>').attr('type', 'file').attr('name', field.name).prop('required',function(){
							return (field.required);
						}).prop('readonly',function(){
							return field.readonly
						}).prop('disabled',function(){
							return field.disabled
						}).prop('multiple',function(){
							return field.multiple
						}).attr('accept',function(){
							return field.accept
						}).addClass(function(){
							if (typeof field.classes !== "undefined") return field.classes;
							else return '';
						}).change(function(){
							if (field.on_change === 'formSubmit') form.submit();
						}).data('exclude',field.exclude).appendTo(inputCont);
						break;
					case 'text':
					case 'email':
					case 'password':
					case 'number':
						$('<input/>').addClass('form-control').attr('type', field.type).attr('name', field.name).prop('required',function(){
							return (field.required);
						}).prop('readonly',function(){
							return field.readonly
						}).prop('disabled',function(){
							return field.disabled
						}).prop('placeholder',function(){
							return field.placeholder
						}).val(function(){
							if (field.value) return field.value;
							else return '';
						}).addClass(function(){
							if (typeof field.classes !== "undefined") return field.classes;
							else return '';
						})
							/*.keyup(function(){
								formTools.formFieldRemoveError($(this));
							})*/
							.change(function(){
							if (field.on_change === 'formSubmit') form.submit();
						}).data('exclude',field.exclude).appendTo(inputCont);
						break;
					case 'textarea':
						var textArea = $('<textarea/>').addClass('form-control').attr('name', field.name).prop('required',function(){
							return (field.required);
						}).attr('id',function(){
							if (typeof field.id !== "undefined") return field.id;
							else return field.name;
						}).attr('rows',function(){
							if (typeof field.rows !== "undefined") return field.rows;
							else return '4';
						}).prop('readonly',function(){
							return field.readonly
						}).prop('disabled',function(){
							return field.disabled
						}).prop('placeholder',function(){
							return field.placeholder
						}).val(function(){
							if (field.value) return field.value;
							else return '';
						}).addClass(function(){
							if (typeof field.classes !== "undefined") return field.classes;
							else return '';
						}).keyup(function(){
							formTools.formFieldRemoveError($(this));
						}).change(function(){
							if (field.on_change === 'formSubmit') form.submit();
						}).data('exclude',field.exclude).appendTo(inputCont);
						if (typeof field.use_editor !== "undefined" && field.use_editor) {
							var editor = CKEDITOR.replace(textArea.attr('id'));
							editor.on('change', function() {
								textArea.val(editor.getData());
								/*changesCount++;
								document.getElementById('content2').style.display = '';
								document.getElementById('changes').innerHTML = changesCount.toString();
								document.getElementById('editorcontent2').innerHTML = editor2.getData();*/
							});
						}
						break;
					case 'select':
						var name = field.name;
						if (field.multiple) name = field.name+'[]';
						var select = $('<select/>').addClass('form-control select2').attr('name', name).prop('required',function(){
							return (field.required);
						}).prop('readonly',function(){
							return field.readonly
						}).prop('disabled',function(){
							return field.disabled
						}).prop('multiple',function(){
							return field.multiple
						}).addClass(function(){
							if (typeof field.classes !== "undefined") return field.classes;
							else return '';
						}).change(function(){
							formTools.formFieldRemoveError($(this));
							if (field.on_change === 'formSubmit') form.submit();
						}).data('exclude',field.exclude).appendTo(inputCont);
						$.each(field.options, function (oKey, option) {
							var optionElem = $('<option/>').val(option.value).html(option.title).prop('disabled',function(){
								return option.disabled;
							});
							if (typeof option.data !== "undefined"){
								$.each(option.data, function(odKey,dataValue){
									optionElem.data(odKey,dataValue);
								});
							}
							if (option.hasOwnProperty('opt_group')) {
								let optGroup = select.find('optgroup[label="'+option.opt_group+'"]');
								if (!optGroup.length) optGroup = $('<optgroup/>').attr('label',option.opt_group).appendTo(select);
								optionElem.appendTo(optGroup);
							} else optionElem.appendTo(select);
						});
						if (typeof field.value !== "undefined") select.val(field.value);
						if (field.select2) {
							let s2options = {width: '100%'};
							if (field.readonly) s2options['disabled'] = 'readonly';
							select.addClass('select2').select2(s2options);
						}
						break;
					case 'date':
						// let dateSingle = $('<div/>').addClass('input-daterange').appendTo(inputCont);
						$('<input/>')
							.attr('type','text')
							.addClass('form-control '+field.type)
							.attr('name',field.name)
							.data('field',field.name)
							.val(field.value)
							/*.change(function(){
								formTools.formFieldRemoveError($(this));
								// if (field.on_change === 'formSubmit') form.submit();
							})*/
							.appendTo(inputCont)
							.prop('required',function(){
								return (field.required);
							}).prop('readonly',function(){
							return field.readonly
						}).prop('disabled',function(){
							return field.disabled
						}).prop('placeholder',function(){
							return field.placeholder
						}).datepicker({
							format: field.format,
							autoclose: true,
							todayBtn: true,
							todayHighlight: true,
						});
						break;
					case 'date_range':
						var initDateRange = formTools.getInitDateRange(field.date_range_prev_days);
						var dateRange = $('<div/>').addClass('input-daterange date_range_'+field.name).appendTo(inputCont);
						$('<input/>')
							.attr('type','text')
							.addClass('form-control date_from '+field.type)
							.attr('name','date_from')
							.data('field',field.name)
							.val(initDateRange.monthStartDay)
							.change(function(){
								formTools.formFieldRemoveError($(this));
								// if (field.on_change === 'formSubmit') form.submit();
							})
							.appendTo(dateRange);
						$('<input/>')
							.attr('type','text')
							.addClass('form-control date_to '+field.type)
							.attr('name','date_to')
							.data('field',field.name)
							.val(initDateRange.nowDate)
							.change(function(){
								formTools.formFieldRemoveError($(this));
								// if (field.on_change === 'formSubmit') form.submit();
							})
							.appendTo(dateRange);
						dateRange.datepicker({
							format: "yyyy-mm-dd",
							autoclose: true,
						});
						break;
					case 'time':
						$('<input/>')
							.attr('type','text')
							.addClass('form-control')
							.attr('name',field.name)
							.val(field.value)
							.appendTo(inputCont)
							.prop('required',function(){ return (field.required); })
							.prop('readonly',function(){ return field.readonly })
							.prop('disabled',function(){ return field.disabled })
							.timepicker({
								template: false,
								showInputs: false,
								minuteStep: 15,
								showMeridian: false,
							});
						break;
					case 'checkbox':
						formTools.formFieldAddCheckbox(inputCont,field);
						/*var checkboxDiv = $('<div/>').addClass('md-checkbox').appendTo(inputCont);
						$('<input/>')
							.prop('readonly',function(){ return field.readonly })
							.prop('disabled',function(){ return field.disabled })
							.attr('type','checkbox')
							.addClass('md-check')
							.attr('name',field.name)
							.attr('id',field.name)
							.prop('checked',function(){ return field.checked; })
							.data('exclude',field.exclude)
							.change(function(){
								formTools.formFieldRemoveError($(this));
								if (field.on_change === 'formSubmit') form.submit();
							})
							.appendTo(checkboxDiv);
						var checkboxLabel = $('<label/>').attr('for',field.name).appendTo(checkboxDiv);
						$('<span/>').addClass('inc').appendTo(checkboxLabel);
						$('<span/>').addClass('check').appendTo(checkboxLabel);
						$('<span/>').addClass('box').appendTo(checkboxLabel);
						checkboxLabel.append(field.title);*/
						break;
				}
				// <div className="invalid-feedback">This field is required</div>
				// $('<div/>').addClass('invalid-feedback').html('This field is required').appendTo(inputCont);
				$('<span/>').addClass('help-block').appendTo(inputCont);
				if (typeof fieldHighlight !== "undefined" && fieldHighlight) formGroup.effect('highlight',1500);
			}
		}
	},
	formGetButtonsCont: function(form){
		var buttonsCont = form.find('.buttons-cont');
		return buttonsCont.find('.buttons-cont-inner');
	},
	inputSlugify: function (source,target){
		target.val(
			source.val()
				.toLowerCase()
				.trim()
				.replace(/[^\w\s-]/g, '')
				.replace(/[\s_-]+/g, '-')
				.replace(/^-+|-+$/g, '')
		);
	},
	formFieldsToObject: function(form) {
		let obj = {};
		let arr = form.serializeArray();
		if (arr) {
			arr.map((item) => { obj[item.name] = item.value; });
		}
		return obj;
	},
	checkIfFieldExclude: function(field){
		if (typeof field.data('exclude') !== "undefined") return field.data('exclude');
		else return false;
	},
	formValidate: function(form,displayErrorMessage){
		var data = {};
		var formErrorFields = [];
		var fieldExclude = false;
		this.formHideAlert(form);
		form.find('input').each(function(){
			fieldExclude = formTools.checkIfFieldExclude($(this));
			if (!fieldExclude) {
				formTools.formFieldRemoveError($(this));
				if ($(this).attr('type') === 'checkbox') { data[$(this).attr('name')] = $(this).prop('checked'); }
				else if ($(this).attr('type') === 'hidden' && $(this).attr('name').includes('[]')) {
					if (!data.hasOwnProperty($(this).attr('name').replace('[]',''))) {
						let hiddenFieldValues = [];
						form.find('[name="'+$(this).attr('name')+'"]').each(function(){
							hiddenFieldValues.push($(this).val());
						});
						data[$(this).attr('name').replace('[]','')] = hiddenFieldValues;
					}
				} else {
					if ($(this).prop('required') && $(this).val() === '') formErrorFields.push($(this));
					else {
						if ($(this).hasClass('date_range')) {
							if (typeof data[$(this).data('field')] === "undefined") data[$(this).data('field')] = {};
							data[$(this).data('field')][$(this).attr('name')] = $(this).val();
						} else data[$(this).attr('name')] = $(this).val();
					}
				}
			}
		});
		form.find('textarea').each(function(){
			fieldExclude = formTools.checkIfFieldExclude($(this));
			if (!fieldExclude) {
				formTools.formFieldRemoveError($(this));
				if ($(this).prop('required') && $(this).val() === '') formErrorFields.push($(this));
				else data[$(this).attr('name')] = $(this).val();
			}
		});
		form.find('select').each(function(){
			fieldExclude = formTools.checkIfFieldExclude($(this));
			if (!fieldExclude) {
				formTools.formFieldRemoveError($(this));
				$(this).closest('.form-group').removeClass('has-error').find('.help-block').html('');
				if ($(this).prop('required') && $(this).val() === '') formErrorFields.push($(this));
				else data[$(this).attr('name')] = $(this).val();
			}
		});

		if (formErrorFields.length) {
			$.each(formErrorFields,function () {
				formTools.formFieldAssignError(this,'Please fill this field');
			});
			if (typeof displayErrorMessage === "undefined" || displayErrorMessage) {
				this.formShowAlert(form, 'alert-danger', 'Please fill the required fields');
			}
			return false;
		} else {
			delete data.undefined;
			return data;
		}
	},
	formFieldAssignError: function(field,helpMessage){
		field.closest('.form-group').addClass('has-error').find('.help-block').html(helpMessage);
	},
	formFieldRemoveError: function(field){
		field.closest('.form-group').removeClass('has-error').find('.help-block').html('');
		this.formHideAlert(field.closest('form'));
	},
	formClearFieldErrors: function(form){
		form.find('.has-error').removeClass('has-error').find('.help-block').html('');
		this.formHideAlert(form);
	},
	formShowAlert: function(form,alertClass,alertMessage){
		form.find('.alerts-cont .alert').addClass(alertClass).html(alertMessage).removeClass('display-none');
	},
	formHideAlert: function(form){
		form.find('.alert').attr('class','').addClass('alert display-none').html('');
	},
};

let attachmentsBarTools = {
	attachmentsBarPopulate: function(target,spinner,endpoint,singleFileUpload){
		if (typeof singleFileUpload === "undefined") singleFileUpload = false;
		let apiUrl = api.cfg.apiUrl;
		let attachmentsBar = $('<div/>').addClass('attachments-bar').appendTo(target);
		let fileUpload = $('<div/>').attr('id','file_upload').appendTo(attachmentsBar);
		let attFilesCont = $('<div/>').addClass('att-files-cont').appendTo(attachmentsBar);
		let filesList = [];
		fileUpload.fileupload({
			url: apiUrl+endpoint,
			dataType: 'json',
			singleFileUploads: singleFileUpload,
		});
		let multiple = !singleFileUpload;
		let fileInput = $('<input/>').attr('type','file').attr('name','attachments[]').attr('id','fileUpload').prop('multiple',multiple).addClass('input-file-upload').change(function(e){
			// if (singleFileUpload) filesList = [];
			let files = e.target.files || [{name: this.value}];
			$.each(files,function (key,file) {
				filesList = attachmentsBarTools.attachmentsAdd(file,filesList,singleFileUpload,attachmentsAlert);
			});
			attachmentsBarTools.attachmentsPopulate(filesList,attFilesCont,spinner);
		}).appendTo(attachmentsBar);
		$('<label/>').attr('for','fileUpload').addClass('btn ui-btn ui-btn-primary').html('Select an Image <i class="fa fa-fw fa-arrow-up"></i>').appendTo(attachmentsBar);
		let attachmentsAlert = $('<div/>').addClass('attachments-alert alert alert-info d-none small mt-3').appendTo(attachmentsBar);
		return {
			fileUpload: fileUpload,
			filesList: filesList,
			fileInput: fileInput,
			attFilesCont: attFilesCont,
			attachmentsAlert: attachmentsAlert,
		};
	},
	attachmentsAdd: function(file,filesList,singleFileUpload,attachmentsAlert){
		// if (singleFileUpload) filesList = [];
		let found = false;
		let maxAttachmentsSizeBytes = 2000000;
		let totalAttachmentsSizeBytes = 0;
		let allowedFileTypes = ['image/png','image/jpeg'];
		attachmentsAlert.addClass('d-none').html('');
		if (allowedFileTypes.includes(file.type)) {
			$.each(filesList,function (fKey,listFile) {
				totalAttachmentsSizeBytes = totalAttachmentsSizeBytes + listFile.size;
				if (file.name === listFile.name && file.size === listFile.size) found = true;
			});
			if (!found){
				if ((totalAttachmentsSizeBytes + file.size) < maxAttachmentsSizeBytes) {
					filesList.push(file);
					if (singleFileUpload && filesList.length > 1) filesList.shift();
				}
				else attachmentsAlert.removeClass('d-none').html('File exceeds allowed size limit (2MB)');
			}
		} else attachmentsAlert.removeClass('d-none').html('File should be of type PNG or JPEG');

		return filesList;
	},
	attachmentsPopulate: function(filesList,target,spinner,link){
		target.empty();
		$.each(filesList,function (fKey,file) {
			let fileSize = {
				size: file.size/1024,
				unit: 'KB'
			};
			if (fileSize.size > 1024) {
				fileSize.size = fileSize.size/1024;
				fileSize.unit = 'MB';
			}
			let html = '<i class="fa fa-file fa-fw"></i> '+file.name+' <span class="att-size">('+(fileSize.size.toFixed(2))+fileSize.unit+')</span>';
			let fileElem = $('<span/>').addClass('att-file att-file-'+fKey).appendTo(target);
			if (typeof link !== "undefined" && link) $('<a/>').addClass('att-filename').attr('href',tickets.config.ticket.fileAttachmentsRoot+file.name).attr('target','_blank').html(html).appendTo(fileElem);
			else {
				$('<span/>').addClass('att-filename').html(html).appendTo(fileElem);
				$('<button/>').addClass('att-remove').html('<i class="fa fa-ban fa-fw"></i>').click(function (e) {
					e.preventDefault();
					filesList = attachmentsBarTools.attachmentsRemove(fKey,filesList);
					if (typeof spinner !== "undefined" && spinner !== null) spinner.addClass('display-none');
					attachmentsBarTools.attachmentsPopulate(filesList,target,spinner,link);
				}).appendTo(fileElem);
				$('<span/>').addClass('att-msg att-'+fKey+'-msg d-none').html('<i class="fa fa-exclamation fa-fw"></i> <span class="msg"></span>').appendTo(fileElem);
			}
		});
	},
	attachmentsRemove: function(fKey,filesList){
		filesList.splice(fKey,1);
		return filesList;
	},
	attachmentsUpload: function(attachmentsObj,callBack){
		let uploadResponse = {
			'result': 'success',
			'files': [],
			'errors': [],
			'message': ''
		};
		if (attachmentsObj.filesList.length > 0) {
			attachmentsObj.fileInput.addClass('d-none').prop('disabled',true);
			attachmentsObj.attFilesCont.find('button.att-remove').prop('disabled',true);
			attachmentsObj.fileUpload.fileupload('send', {files: attachmentsObj.filesList})
				.done(function (response, textStatus, jqXHR) {
					if (response) {
						if (response.result === 'success') {
							uploadResponse.files = response.files;
							if (typeof callBack === "function") callBack(uploadResponse);
						} else {
							console.log(response);
							$.each(response.errors, function (eKey, error) {
								if (typeof error.file_key !== "undefined") {
									let fileMsgCont = $('.att-' + error.file_key + '-msg');
									fileMsgCont.find('.msg').html(error.msg);
									fileMsgCont.removeClass('d-none');
								}
							});
							attachmentsObj.fileInput.removeClass('d-none').prop('disabled',false);
							uploadResponse.result = 'failed';
							uploadResponse.errors = response.errors;
							uploadResponse.message = (response.errors.length) + ' error(s) occurred while uploading attachments';
							attachmentsObj.attFilesCont.find('button.att-remove').prop('disabled',false);
							if (typeof callBack === "function") callBack(uploadResponse);
						}
					} else {
						console.log({
							textStatus: textStatus,
							jqXHR: jqXHR
						});
						attachmentsObj.fileInput.removeClass('d-none').prop('disabled',false);
						uploadResponse.result = 'failed';
						uploadResponse.message = 'An unknown error has occurred';
						attachmentsObj.attFilesCont.find('button.att-remove').prop('disabled',false);
						if (typeof callBack === "function") callBack(uploadResponse);
					}
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					console.log({
						textStatus: textStatus,
						errorThrown: errorThrown,
						jqXHR: jqXHR
					});
					attachmentsObj.fileInput.removeClass('d-none').prop('disabled',false);
					uploadResponse.result = 'failed';
					uploadResponse.message = textStatus;
					attachmentsObj.attFilesCont.find('button.att-remove').prop('disabled',false);
					if (typeof callBack === "function") callBack(uploadResponse);
				});
		} else if (typeof callBack === "function") callBack(uploadResponse);
	},
	attachedFilesPopulate: function(target,attachments,format,containerClass){
		target.html('');
		let attachmentsCont = $('<div/>').addClass(containerClass).appendTo(target);
		if (format === 'json') attachments = JSON.parse(attachments);
		$.each(attachments, function () {
			let fileName, href;
			fileName = this.fileName.substring(15);
			href = generic.cfg.baseUrl+'attachments/get?file='+this.fileName+'&file-name='+fileName+'&content-type='+this.type;
			$('<a/>')
				.addClass('attachment-file attached-file')
				.attr('href', href)
				.attr('download',fileName)
				.html('<i class="fa fa-file fa-fw"></i> ' + fileName)
				.appendTo(attachmentsCont);
		});
	},
	attachmentDeleteUploadedFiles: function (filesList){
		api.call('deleteUploadedFiles', {files: filesList});
	},
};

let utils = {

};

let api = {
	cfg: {
		apiUrl: '/javaabu/api/',
		btnHTML: {},
	},

	callAPI: (endpoint,payload,spinnerTarget,spinnerHTML,callback) => {
		let post_url = encodeURI(api.cfg.apiUrl+endpoint+'/');
		$.ajax({
			url:  post_url,
			type: 'POST',
			data: payload,
			dataType: 'json',
			success: function(response){
				if (typeof spinnerTarget !== "undefined" && spinnerTarget !== null) generic.removeSpinner(spinnerTarget,spinnerHTML);
				if (response.status === false && ['session_expired','recaptcha_error'].includes(response.message)) {
					console.error(response);
					let modal = modalTools.modalCreate($('body'));
					modalTools.modalSetBody(modal,response.message);
					modalTools.modalShow(modal);
				} else if (typeof callback === 'function') callback(response);
			},
			error: function(xhr, status, error){
				console.log(error);
				console.log(xhr);
			}
		});
	},
};

let generic = {
	showSpinner: (target, message) => {
		target.prop('disabled',true);
		if (typeof message === "undefined") message = '';
		let targetHtml = target.html();
		target.html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> '+message).appendTo(target);
		/*fetching: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching data...',
		processing: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Processing data...',*/
		return targetHtml;
	},
	removeSpinner: (target,targetHtml) => {
		target.prop('disabled',false);
		target.html(targetHtml);
	},
};
