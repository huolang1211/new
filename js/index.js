$(function(){
	// 加载数据的方法
	function loadData() {
		var collection = localStorage.getItem('todo');
		if(collection){
			return JSON.parse(collection);
		}else{
			return [];
		}
	}
	// 保存数据的方法
	function saveData(data) {
		localStorage.setItem('todo',JSON.stringify(data));
	}
	// 加载网页数据
	load();
	function load(){
		var todoCount = 0;
		var doneCount = 0;
		var todoStr = "";
		var doneStr = "";
		var todoList = loadData();
		if(todoList && todoList.length > 0){
			// 有数据
			// forEach遍历
			todoList.forEach(function(data,i){
				if(data.done){
					// 已经完成
					doneStr += `			
						<li>
							<input type="checkbox" index=${i} checked='checked'>
							<p id="p-${i}" index=${i}>${data.title}</p>
							<a href="javascript:;">-</a>
						</li>
						`;
					doneCount ++;

				}else{
					// 正在进行
					todoStr += `			
						<li>
							<input type="checkbox" index=${i} >
							<p id="p-${i}" index=${i}>${data.title}</p>
							<a href="javascript:;">-</a>
						</li>
					`;
					todoCount ++;
				}
				$('#todolist').html(todoStr);
				$('#donelist').html(doneStr);
				$("#todocount").html(todoCount);
				$('#donecount').html(doneCount);
			})
		}else{
			// 无数据
			$('#todolist').html("");
			$('#donelist').html("");
			$("#todocount").html(todoCount);
			$('#donecount').html(doneCount);
		}
	}
	// 添加数据方法
	$('#title').keydown(function(event){
		if (event.keyCode === 13){
			// 获取输入框中的值
			var val =  $(this).val();
			if(!val){
				alert('输入值不能为空');
			}else{
				var data = loadData();
				data.unshift({
					title:val,
					done:false
				});
				// 清空输入框中的值
				$(this).val("");
				saveData(data);
				// 重新加载数据
				load();
			}
		}
	})

	// 事件代理的方式 删除数据
	$('#todolist').on('click','a',function(){
		var todoList = loadData();
		var i = $(this).parent().index();
		todoList.splice(i,1);
		saveData(todoList);
		load();
	})
	$('#donelist').on('click','a',function(){
		var todoList = loadData();
		var i = parseInt($($(this).parent().children()[0]).attr('index'));
		todoList.splice(i,1);
		saveData(todoList);
		load();
	})

	// 更新数据
	$('#todolist').on('change','input[type=checkbox]',function(){
		var i = parseInt($(this).attr('index'));
		update(i,'done',true);
	})
	$('#donelist').on('change','input[type=checkbox]',function(){
		var i = parseInt($(this).attr('index'));
		update(i,'done',false);
	})
	function update(i,key,value){
		var data = loadData();
		var todo = data.splice(i,1)[0];
		todo[key] = value;
		data.splice(i,0,todo);
		saveData(data);
		load();
	}
	// 编辑操作
	$('.demo-box').on('click','p',function(){
		var i = parseInt($(this).attr('index'));
		var title = $(this).html();
		var $p = $(this);
		$p.html(`
				<input type="text" id='input-${i}' value=${title}>
			`)
		// 选中
		$(`#input-${i}`)[0].setSelectionRange(0,$(`#input-${i}`).val().length);
		// 获取焦点
		$(`#input-${i}`).focus();
		// input再次被单击时保证数据不变
		$(`#input-${i}`).click(function(){
			$p.html(title);
		})
		// 失去焦点保存更改的数据
		$(`#input-${i}`).blur(function(){
			if($(this).val().length === 0){
				// 用户输入为空
				$p.html(title);
				alert('内容不能为空');
			}else{
				update(i,'title',$(this).val())
			}
		})
	})
	// 清空数据
	$('footer a:first').click(function(){
		localStorage.removeItem('todo');
		load();
	})
})