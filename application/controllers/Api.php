<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
		parent::__construct();
	}

	public function uploadDocs(){
		return $this->Api_model->uploadDocs();
	}

	public function deleteUploadedFiles(){
		$this->Api_model->deleteUploadedFiles($this->input->post());
	}

	public function articleSave(){
		$this->Api_model->articleSave($this->input->post());
	}

}
