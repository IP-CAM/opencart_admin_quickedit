<?php
class ModelModuleQuickedit extends Model {
	public function getLanguageIdByCode($code) {
		$sql = "SELECT language_id FROM " . DB_PREFIX . "language WHERE code='" . $code . "'"; 

		$result = $this->db->query($sql);

		return $result->row['language_id'];
	}

	public function editProduct($data) {
		switch ($data['key']) {
			case 'name':
				$sql = "UPDATE " . DB_PREFIX . "product_description SET " . $data['key'] . " = '" . $data['value'] . "' WHERE product_id = " . $data['id'] . " AND language_id = " . $data['language_id'];
				break;
			case 'price':
			case 'model':
			case 'quantity':
				$sql = "UPDATE " . DB_PREFIX . "product SET " . $data['key'] . " = '" . $data['value'] . "' WHERE product_id = " . $data['id'];
				break;
			
			default:
				$sql = '';
				break;
		}

		return $this->db->query($sql);
	}

	public function changeStatus($product_id) {
		$this->db->query("UPDATE " . DB_PREFIX . "product SET status = NOT status WHERE product_id = " . $product_id);
	}
}