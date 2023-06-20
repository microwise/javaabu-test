<?php

class Generic_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

	public function attachmentsUpload(){
		$uploadsCfg = $this->config->item('uploads');
		if (isset($_FILES) && is_array($_FILES) && count($_FILES['files']['name'])) {
			$response = array();
			$targetDir = realpath(APPPATH . $uploadsCfg['target_dir']);
			$maxUploadFileSize = $uploadsCfg['max_total_files_size_mb']*1024*1024;
			$allowedFileTypes = array('jpg','jpeg','png','pdf');
			$files = array();
			$filesSize = 0;
			foreach ($_FILES['files'] as $key => $value){
				foreach ($value as $viKey => $valueItem){
					if (!isset($files[$viKey])) $files[$viKey] = array();
					$files[$viKey][$key] = $valueItem;
					if ($key == 'size') $filesSize = $filesSize + intval($valueItem);
				}
			}

			$response['errors'] = array();
			if ($filesSize > $maxUploadFileSize) {
				$response['errors'][] = array(
					'type' => 'file-size-all',
					'msg' => 'Total attachments size exceeds allowed limit'
				);
			} else {
				foreach ($files as $key => $file) {
					if ($file['size'] > $maxUploadFileSize) {
						$response['errors'][] = array(
							'file' => $file,
							'file_key' => $key,
							'type' => 'file-size',
							'msg' => 'File is too large'
						);
					} elseif (!in_array(strtolower(pathinfo($targetDir.basename($file['name']),PATHINFO_EXTENSION)),$allowedFileTypes)){
						$response['errors'][] = array(
							'file' => $file,
							'file_key' => $key,
							'type' => 'file-type',
							'msg' => 'Invalid file type'
						);
					}
				}
			}

			if (!count($response['errors'])) {
				$successFiles = array();
				foreach ($files as $key => $file) {
					$targetFilename = date('YmdHis').'-'.str_replace([' ','(',')'],['-','',''],$file['name']);
					$targetFile = $targetDir ."/".$targetFilename;
					if (!move_uploaded_file($file["tmp_name"], $targetFile)) {
						$response['errors'][] = array(
							'file' => $file,
							'file_key' => $key,
							'type' => 'upload',
							'msg' => 'Failed to upload file'
						);
					} else {
						$files[$key]['name'] = $targetFilename;
						unset($files[$key]['error']);
						unset($files[$key]['tmp_name']);
						$successFiles[] = $targetFile;
					}
				}
				if (!count($response['errors'])) $response['result'] = 'success';
				else foreach ($successFiles as $successFile) unlink($successFile);
			} else $response['result'] = 'error';

			$response['files'] = $files;
			return $response;

		} else return false;
	}

	public function deleteUploadedFiles($files){
		if (!is_array($files) || !count($files)) {
			return ['result' => false, 'message' => 'No files to delete'];
		} else {
			$uploadsCfg = $this->config->item('uploads');
			$targetDir = realpath(APPPATH . $uploadsCfg['target_dir']);
			foreach ($files as $file) {
				unlink($targetDir ."/".$file['name']);
			}
			return ['result' => true, 'message' => 'Files deleted'];
		}
	}
}
