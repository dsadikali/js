var project_array = [];
var startflag=false;
	function startTime(){
		$('.select-project select').prop('disabled',true);
		startflag=true;
		}
		
		
	function stopTime(){
		startflag=false;
		$('.select-project select').prop('disabled',false)
		var tableIndex;
		$('.project-grid table tr td.proName').each(function(){
			if($(this).text() == $('.project-grid tr.active .proName').text())
				tableIndex=$(this).closest('tr').index()
		});	
		if(localStorage.getItem('jsonFlag')=='true')
		{
		project_array = JSON.parse(localStorage.getItem('projectArray'));
		}
		for(var project in project_array)
		{
			if(project_array[project].name == $('.project-grid tr.active .proName').text())
			{
				project_array[project].hour = parseInt($('.the-time .hr').text());
				project_array[project].minute = parseInt($('.the-time .min').text());
				project_array[project].seconds = parseInt($('.the-time .sec').text());
				
		
		localStorage.setItem('projectArray',JSON.stringify(project_array));
				if(project_array[project].hour<10)
				 	$('.project-grid table tr').eq(tableIndex).find('td').find('.hr').text("0"+project_array[project].hour);
				else
					$('.project-grid table tr').eq(tableIndex).find('td').find('.hr').text(project_array[project].hour);
				if(project_array[project].minute<10)
				 	$('.project-grid table tr').eq(tableIndex).find('td').find('.min').text("0"+project_array[project].minute);
				else
					$('.project-grid table tr').eq(tableIndex).find('td').find('.min').text(project_array[project].minute);
				if(project_array[project].seconds<10)
					$('.project-grid table tr').eq(tableIndex).find('td').find('.sec').text("0"+project_array[project].seconds);
				else
					$('.project-grid table tr').eq(tableIndex).find('td').find('.sec').text(project_array[project].seconds);
			}
		}
		if(localStorage.getItem('jsonFlag')=='true')
		{
		localStorage.setItem('projectArray',JSON.stringify(project_array));
		}
		
	}