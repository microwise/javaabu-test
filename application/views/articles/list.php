<div class="container">
	<div class="row">
		<div class="col">
			<a href="#" class="btn ui-btn ui-btn-primary article-action" data-action="create" data-id="new"><i class="fa fa-fw fa-plus"></i> Add New</a>
		</div>
	</div>

	<div class="row listings mt-4">
		<?php for($i = 0; $i < 10; $i++) {
			$this->load->view('articles/list-item',['id' => $i+1]);
		} ?>
	</div>
</div>
