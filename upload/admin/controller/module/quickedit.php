<?php
Class ControllerModuleQuickedit extends Controller {
	private $message = array();
	
	public function index() {
		if($this->request->server['REQUEST_METHOD'] == 'POST'){
			if($this->validate()){
				$this->load->model('module/quickedit');

				$data['id'] = $this->request->post['id'];
				$data['key'] = $this->request->post['key'];
				$data['value'] = $this->request->post['value'];
				$data['language_id'] = $this->model_module_quickedit->getLanguageIdByCode($this->config->get('config_language'));

				if($this->model_module_quickedit->editProduct($data)) {
					$json['value'] = $data['value'];

					$this->response->addHeader('Content-Type: application/json');
					$this->response->setOutput(json_encode($json));
				}
			} else {
				$this->response->addHeader('Content-Type: application/json');
				$this->response->setOutput(json_encode($this->message));
			}
		}
	}

	public function validate() {
		$this->language->load('module/quickedit');
		if($this->request->post['key']=='name' && (utf8_strlen($this->request->post['value']) < 3 || utf8_strlen($this->request->post['value']) > 255)) {
			$this->message['error'][] = $this->language->get('error_name');
		}

		if($this->request->post['key']=='model' && (utf8_strlen($this->request->post['value']) < 1 || utf8_strlen($this->request->post['value']) > 64)) {
			$this->message['error'][] = $this->language->get('error_model');
		}

		return !$this->message;
	}

	public function changeStatus() {
		if($this->request->server['REQUEST_METHOD'] == 'POST' && $this->request->post['id']){
			$this->load->model('module/quickedit');
			$this->model_module_quickedit->changeStatus($this->request->post['id']);
		}
	}
}