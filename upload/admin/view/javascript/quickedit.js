$(document).ready(function () {
	/**
	* Событие, инициализирует новое окно
	*/
	$('.quickedit').on('click', function(){
		var id = $(this).attr('data-id');
		var key = $(this).attr('data-key');
		var value = $(this).attr('data-value');
		var that = this;
		closeModal();
		openModal(id, key, value, that);
	});
	/**
	* Событие, инициализирует запрос на изменение статуса
	*/
	$('.material-switch input[name="status"]').on('change', function(){
		var id = $(this).parent().attr('data-id');
		changeStatus(id);
	});

	$('html').on('click', '.quickedit_form-button', function(e){
		e.preventDefault();
		var link = $(this).attr('href');
		openForm(link);
	});

	/**
	* Событие, инициирует закрытие окна
	*/
	$('html').on('click', '.quickedit-container .quickedit-close', function(){
		closeModal();
	});

	/**
	* Событие, инициирует отправку данных 
	*/
	$('html').on('click', '.quickedit-container .quickedit-submit', function() {
		var that = $(this).parents('.quickedit-container');
		ajaxRequest(that);
	})

	/**
	* Событие, валидация цены, запрет на ввод любых символов кроме цифр
	*/
	$('html').on('keydown', '.quickedit-container input.price .quickedit-container input.quantity', function(event){
		// Разрешаем: backspace, delete, tab и escape
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
        	event.keyCode == 189 || event.keyCode == 110 ||
             // Разрешаем: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Разрешаем: home, end, влево, вправо
            (event.keyCode >= 35 && event.keyCode <= 39) || 
			(event.keyCode == 190)) {
                 // Ничего не делаем
                 return;
        }
        else {
            // Убеждаемся, что это цифра, и останавливаем событие keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
	});
});

/**
* Событие, закрывает окно при клике мимо него
*/
$(document).on('mouseup', function (e){ 
	var div = $(".quickedit-container, .quickedit-form-wrapper"); 
	if (!div.is(e.target) && div.has(e.target).length === 0) { 
		div.fadeOut('slow', function(){
			div.remove();
			$('.quickedit-overlay').remove();
		});
	}
});

/**
* Открывает окно ввода нового значения
*
* @param {number} id - Идентификатор товара
* @param {string} key - Имя редактируемого поля
* @param {mixed} value - Значение поля
* @param {object} object - Jquery-объект, который вызвал функцию
*
*/
function openModal(id, key, value, object) {
	$(object).parents('td').append('<div class="quickedit-container">' +
		'<input type="hidden" name="id" value="' + id + '">' +
		'<input type="hidden" name="key" value="' + key + '">' +
		'<input type="text" class="' + key + '" name="value" value="' + value + '">'+
		'<span class="quickedit-submit btn btn-primary"><i class="fa fa-check" aria-hidden="true"></i></span>'+
		'<span class="quickedit-close btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i></span>'+
	'</div>');
	$(object).parents('td').children('.quickedit-container').fadeIn('fast');
}

/**
* Закрывает окно ввода данных
*/
function closeModal() {
	$('.quickedit-container').fadeOut('fast', function(){
		$(this).remove();
	});
}

/**
* Отправляет ajax-запрос на сервер с новым значение поля
* 
* @param {object} object - Объект окна, из которого производится отправка данных
*/
function ajaxRequest(object) {
	var id = $(object).children('input[name="id"]').val();
	var key = $(object).children('input[name="key"]').val();
	var value = $(object).children('input[name="value"]').val();
	var token = $('form#form-product').attr('data-token');

	$.ajax({
		url: 'index.php?route=module/quickedit&token=' + token,
		type: 'POST',
		data: {
			id:id,
			key:key,
			value:value
		},
		beforeSend: function() {
			$(object).children('input[type="text"]').attr('disabled', 'disabled');
		},
		success: function(json) {
			if(json['error']) {
				json['error'].forEach(function(item, i, arr){
					$(object).append('<div class="text-danger">' + json['error'][i] + '</div>');
				});
				$(object).children('input[type="text"]').removeAttr('disabled');
			}

			if(json['value']) {
				$(object).parents('td').find('.quickedit').text(json['value']);
				$(object).parents('td').find('.quickedit').attr('data-value', json['value']);
				$(object).fadeOut('fast', function(){
					$(this).remove();
				});
			}
		}
	});
}
/**
* Отправляет запрос для изменения статуса товара
*
* @param  {numeber} id - Идентификатор товара
*/
function changeStatus(product_id) {
	var token = $('form#form-product').attr('data-token');

	$.ajax({
		url: 'index.php?route=module/quickedit/changeStatus&token=' + token,
		type: 'POST',
		data: {
			id: product_id
		}
	});
}

function openForm(url) {
	$.ajax({
		url: url,
		success: function(html){
			$('body').append(
				'<div class="quickedit-overlay"></div>' +
				'<div class="quickedit-form-wrapper">' + 
					'<div class="quickedit-form">' + html + '</div>' +
				'</div>');
		}
	});
}