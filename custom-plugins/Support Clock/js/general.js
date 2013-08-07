var project_array;
function deleteRow(projectCount)
{
	$('.project-grid table tr.'+projectCount).remove();
	$('.select-project select option.'+projectCount).remove();
	project_array = [];
	projectCount--;
	$('.project-grid table tr').each(function(){
		$(this).attr('class','');
		var class_number = $('.project-grid table tr').size()-$(this).index()-1;
		$(this).attr('class',class_number);
		$(this).find('.delete').attr('onClick','deleteRow('+class_number+')');
		var pro_obj = {
			name :$(this).find('.proName').text(),
			hour : parseInt($(this).find('.hr').text()),
			minute : parseInt($(this).find('.min').text()),
			seconds : parseInt($(this).find('.sec').text())
		}
		project_array.push(pro_obj);
	})
	
	localStorage.setItem('projectArray',JSON.stringify(project_array.reverse()));
	
}

var projectCount=0;
$(document).ready(function(){
	
	var xx=1;
	if(localStorage.getItem('jsonFlag')=='true')
	{
	project_array = JSON.parse(localStorage.getItem('projectArray'));
	if(project_array)
	{
	if(project_array.length>0)
	{
		$('.timeBox-outer').css('visibility','visible');
		for(var project in project_array)
		{
			var hour = project_array[project].hour;
			var minute = project_array[project].minute;
			var seconds =project_array[project].seconds;
			if(hour<10)
				hour='0'+hour;
			if(minute<10)
				minute='0'+minute;
			if(seconds<10)
				seconds='0'+seconds;
				if(project==project_array.length-1)
				{
					$('.the-time .hr').text(hour);
					$('.the-time .min').text(minute);
					$('.the-time .sec').text(seconds);
					$('.project-grid table').prepend('<tr class="'+project+' active"><td class=delete onClick="deleteRow('+project+')"><a href=javascript:; title="Delete this project">X</a></td><td class="proName">'+project_array[project].name+'</td><td class="working-time"><span class="hr">'+hour+'</span>:<span class="min">'+minute+'</span>:<span class="sec">'+seconds+'</span></td></tr>');
				}
				else
						$('.project-grid table').prepend('<tr class="'+project+'"><td class=delete onClick="deleteRow('+project+')"><a href=javascript:; title="Delete this project">X</a></td><td class="proName">'+project_array[project].name+'</td><td class="working-time"><span class="hr">'+hour+'</span>:<span class="min">'+minute+'</span>:<span class="sec">'+seconds+'</span></td></tr>');
			$('.select-project select').prepend('<option class="'+project+'" value='+project_array[project].name+'>'+project_array[project].name+'</option>').prop('disabled',false);
			projectCount++;
		}
		
	}
	}
	}
	$(document).on('click','.project-grid tr',function(){
		if(startflag==false)
		{
	//$('.project-grid tr').click(function(){
		$('.project-grid tr.active').removeClass('active');
		$(this).addClass('active');
		for(var project in project_array)
		{
			if(project_array[project].name ==$(this).find('.proName').text())
			{
				
				if(project_array[project].hour<10)
				 	$('.the-time .hr').text('0'+project_array[project].hour);
				else
					$('.the-time .hr').text(project_array[project].hour);
				if(project_array[project].minute<10)
				 	$('.the-time .min').text('0'+project_array[project].minute);
				else
					$('.the-time .min').text(project_array[project].minute);
				if(project_array[project].seconds<10)
					$('.the-time .sec').text('0'+project_array[project].seconds);
				else
					$('.the-time .sec').text(project_array[project].seconds);
			}
		}
	}
	});
	$(document).keypress(function(e){
		if(e.keyCode==13)
		{
			$('.addProjectName').trigger('click');
			$('.projectName').setfocus();
		}
	});

	$('.addProjectName').click(function(){
		
			if($('.projectName').val() == "")
				alert("Please add proper project name")
			else if(projectCount > 10)
				alert("You can not add more than 10 project")
			 
		else{
			var flag = false;
			for(var project in project_array)
			{
				if($('.projectName').val() == project_array[project].name)
					flag=true;
			}
			if(flag==false)
			{
				if($('.start-stop').hasClass('stop')){
					$('.select-project select').prop('disabled',true);		
					}
				else{
					$('.select-project select').prop('disabled',false);
					$('.timeBox-outer').css('visibility','visible');
				}
								
		localStorage.setItem(xx, $('.projectName').val())
		$('.select-project select').prepend('<option value='+$('.projectName').val()+'>'+$('.projectName').val()+'</option>')
		xx=xx+1;
		
		var pro_obj = {
			name :$('.projectName').val(),
			hour : 0,
			minute : 0,
			seconds : 0
		}
		project_array.push(pro_obj);
		localStorage.setItem('projectArray',JSON.stringify(project_array));
		localStorage.setItem('jsonFlag',true);
		$('.project-grid table').prepend('<tr class="'+projectCount+'"><td class=delete onClick="deleteRow('+projectCount+')"><a href=javascript:; title="Delete this project">X</a></td><td class="proName">'+$('.projectName').val()+'</td><td class="working-time"><span class="hr">00</span>:<span class="min">00</span>:<span class="sec">00</span></td></tr>');
		projectCount++;
			}
			else{
				flag=false;
				alert("Project is already exists...")
				localStorage.setItem('jsonFlag',false);
			}
			
			}	
		$('.projectName').val('');
		
		})
	$('.start-stop').click(function(){
		alert(0)
	})
			
	$('.clear').click(function(){
		localStorage.clear();
		xx=1;
		})

	$('.select-project select').change(function(){
		
	});
$('.timeBox').stopwatch();
$('.clear').click(function(){
		localStorage.clear();
		project_array =[];
		$('.project-grid table tr').remove();
		$('.select-project select option').remove();
		$('.select-project select').prop('disabled',true);
		$('.timeBox-outer').css('visibility','hidden');
		$('.projectName').val('');
		projectCount=0;
		})
})