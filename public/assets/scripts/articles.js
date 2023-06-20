let articles = {
	dom: {
		btnArticleAction: null,
		attachmentsBarDocuments: null,
	},

	formFields: [
		{type: 'hidden', name: 'art_id'},
		{title: 'Title', type: 'text', name: 'art_title', cols: 10, placeholder: 'Title', required: true},
		{title: 'Slug', type: 'text', name: 'art_slug', cols: 10, placeholder: 'Slug', readonly: true},
		{title: 'Content', type: 'textarea', name: 'art_content', cols: 10, rows: 10, placeholder: 'Start Writing...', use_editor: true, required: true},
		{title: 'Excerpt', type: 'textarea', name: 'art_excerpt', cols: 10, rows: 7, placeholder: 'Start Writing...', required: true},
		{title: 'Published Date', type: 'date', name: 'art_published_date', format: 'yyyy-mm-dd','cols': 3, placeholder: 'Published Date', required: true},
	],

	uploads: {
		artUploadsObj: null,
	},

	init: function (){
		articles.dom.btnArticleAction.click(function(e){
			e.preventDefault();
			let data = $(this).data();
			articles.showForm(data);
		});
	},

	showForm: function (data){
		let modal;
		let target = $('body');
		switch (data.action){
			case 'create':
				modal = modalTools.modalCreate(target,{modal_size: 'full'});
				modalTools.modalSetTitle(modal,'New Post');
				let form = formTools.formCreate(modalTools.modalGetBody(modal),'form-horizontal needs-validation',true,function(payload){
					delete payload['attachments[]'];
					let btnSave = form.find('.btn-save');
					let btnCancel = form.find('.btn-cancel');
					let formAlert = form.find('.alerts-cont .alert');
					console.log(articles.uploads.artUploadsObj);
					if (articles.uploads.artUploadsObj.filesList.length) {
						btnSave.prop('disabled',true).html('<i class="fa fa-circle-o-notch fa-spin"></i> Uploading files...');
						btnCancel.prop('disabled',true);
						attachmentsBarTools.attachmentsUpload(articles.uploads.artUploadsObj,(uploadResponse) => {
							if (uploadResponse.result === 'failed') {
								formAlert.addClass('alert-danger').removeClass('d-none').html(uploadResponse.message);
								btnSave.prop('disabled',false).html('Save');
								btnCancel.prop('disabled',false);
							} else {
								payload['art_image'] = uploadResponse;
								articles.save(data.action,payload,btnSave);
							}
						});
					} else {
						payload['art_image'] = [];
						articles.save(data.action,payload,btnSave);
					}
				});
				formTools.formPopulate(form,articles.formFields,[
					{ title: 'Save', classes: 'btn ui-btn ui-btn-primary mr-3 btn-save', clickAction: function () {
						form.submit();
					}},
					{ title: 'Cancel', classes: 'btn ui-btn ui-btn-secondary btn-cancel', clickAction: function () {
						modalTools.modalDestroy(modal);
					}}
				]);
				let fieldsCont = formTools.formGetFieldsCont(form);
				fieldsCont.append('<div class="row mb-3"><label for="art_image" class="control-label col-md-2">Featured Image</label><div class="col-md-10 art-image-upload"></div></div>');
				articles.dom.attachmentsBarDocuments = form.find('.art-image-upload');
				articles.uploads.artUploadsObj = attachmentsBarTools.attachmentsBarPopulate(articles.dom.attachmentsBarDocuments,null,'uploadDocs',true);
				form.find('input[name="art_title"]').keyup(function (){
					formTools.inputSlugify($(this),form.find('input[name="art_slug"]'));
				});
				break;
			case 'edit':
				modal = modalTools.modalCreate(target,{modal_size: 'full'});
				modalTools.modalSetTitle(modal,'Edit Post');
				break;
			case 'delete':
				modal = modalTools.modalCreate(target,{modal_size: 'sm'});
				let modalBody = modalTools.modalGetBody(modal);
				modalBody.addClass('text-center');
				$('<div/>').addClass('font-weight-bold').html('Are you sure you want to delete the article?').appendTo(modalBody);
				let actions = $('<div/>').addClass('modal-actions').appendTo(modalBody);
				$('<a/>')
					.attr('href','#').addClass('btn ui-btn ui-btn-primary mr-3').html('Yes')
					.click(function (e){
						e.preventDefault();
						articles.delete(data.id,$(this));
					}).appendTo(actions);
				$('<a/>')
					.attr('href','#').addClass('btn ui-btn ui-btn-secondary').html('No')
					.click(function (e){
						e.preventDefault();
						modalTools.modalHide(modal);
					}).appendTo(actions);
				break;
		}
		modalTools.modalShow(modal);
	},

	delete: function(id,btn){
		console.log(id);
		btn.remove();
	},

	save: function(action,payload,btn){
		console.log(payload);
		payload['action'] = action;
		btn.html('Submit');
		api.callAPI('articleSave',payload,btn,'Submitting...',(response) => {
			console.log(response);
			/*if (!response.status) {
				page.dom.alert.addClass('alert-danger').removeClass('d-none').html(response.message);
				page.dom.btnCancel.prop('disabled',false);
				return false;
			} else {
				page.dom.btnSubmit.prop('disabled',true).html('Submit');
				window.location.href = page.redirectUrl;
				return true;
			}*/
		});
	}
};

$(document).ready(function() {
	articles.dom.btnArticleAction = $('.article-action');
	articles.init();
});
