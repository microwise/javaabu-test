<?php
if (!defined('BASEPATH')) exit ('No direct script access allowed');

class Api_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$db = $this->load->database();
	}

	private function output($response){
		header('content-type:application/json; charset=UTF-8');
		print_r(json_encode($response));
		exit();
	}

	public function deleteUploadedFiles($params){
		$this->output($this->Generic_model->deleteUploadedFiles($params['files']));
	}
	public function uploadDocs(){
		$this->output($this->Generic_model->attachmentsUpload());
	}

	public function articleSave($post){
		if ($post['action'] == 'create') {
			unset($post['action']);
			$post['art_image'] = $post['art_image']['files'][0]['name'];
			// $this->output($post);
			if ($this->db->insert('articles',$post)) $this->output(['status' => true, 'message' => 'Post created successfully']);
			else $this->output(['status' => false, 'message' => 'Failed to create post']);
		}
	}
}
