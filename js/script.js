window.onload=function(){
    
	var canvas=document.getElementById('myCanvas');
	var context=canvas.getContext('2d');
	var color=true;  //黑子还是白子
	var board=new Array();

	var wins=new Array();  //赢法数组

	//赢法统计数组
	var myWin=new Array();  
	var computerWin=new Array(); 

	var over=false;
	var count=0;

	for(var i=0;i<15;i++){
		board[i]=new Array();
		for(var j=0;j<15;j++){

           board[i][j]=0;
		}
	}

	
	context.strokeStyle="#BFBFBF";

	for(var i=0;i<15;i++){
      //horizontal
	    context.moveTo(15,15+30*i);
	    context.lineTo(435,15+30*i);
	    context.stroke();
      //vertical
	    context.moveTo(15+30*i,15);
	    context.lineTo(15+30*i,435);
	    context.stroke();
    }


/*******************所有赢法穷举*******************************************/    
	//初始化3维数组赢法
	for(var i=0;i<15;i++){
		wins[i]=new Array();
		for(var j=0;j<15;j++){
           wins[i][j]=new Array();
		}
	}
   
   //横向所有赢法
    for(var i=0;i<15;i++){
    	for(var j=0;j<11;j++){
    		for(var k=0;k<5;k++){
    			wins[i][j+k][count]=true;
    		}
    		count++;
    	}
    	
    }

    //垂直所有赢法
     for(var i=0;i<11;i++){
    	for(var j=0;j<15;j++){
    		for(var k=0;k<5;k++){
    			wins[i+k][j][count]=true;
    		}
    		count++;
    	}
    }
   
   //斜线所有
   for(var i=0;i<11;i++){
    	for(var j=0;j<11;j++){
    		for(var k=0;k<5;k++){
    			wins[i+k][j+k][count]=true;
    		}
    		count++;
    	}
    	
    }


    //反斜线
    for(var i=0;i<11;i++){
    	for(var j=14;j>=4;j--){
    		for(var k=0;k<5;k++){
    			wins[i+k][j-k][count]=true;
    		}
    		count++;
    	}
    	
    }


    /*******************所有赢法穷举*******************************************/  
   //初始化
    for( var i=0;i<count;i++){
    	myWin[i]=0;
    	computerWin[i]=0;
    }


  document.getElementById("restart").onclick = function(){
    window.location.reload();
}
   
 canvas.onclick=function(event){

       if(over){
          return;
       }

       if(!color){ 
       	return; 
       }


	   var x=event.offsetX;
	   var y=event.offsetY;
	   var i=Math.floor(x/30);
	   var j=Math.floor(y/30);

	if(!board[i][j]){
	   oneStep(i,j,color);
	   board[i][j]=1;

	    for( var k=0;k<count;k++){
	   	  if(wins[i][j][k]){
	   	  	myWin[k]++;
	   	    computerWin[k]=8;
	   	     if(myWin[k]==5){
	   	     	alert("齐剑伟赢了"); 
	   	     	over=true;
	   	     }
	   	  }
	    }
         if(!over){
           color=!color;
      	   computerAI();
         }
	}
 }
	 

	  






function oneStep(i,j,color){
  var gradient=context.createRadialGradient(15+30*i,15+30*j,13,15+30*i,15+30*j,0);
  if(color){
  	gradient.addColorStop(0,'#0A0A0A');
    gradient.addColorStop(1,'#636766');
   }
  else{
  	 gradient.addColorStop(0,'#D1D1D1');
     gradient.addColorStop(1,'#F9F9F9');
    }

     context.beginPath();
     context.arc(15+30*i,15+30*j,13,0,2*Math.PI);
 
     context.fillStyle=gradient;
     context.fill();
     context.closePath();
  
 }


function computerAI(){

     var myScore=new Array();
     var computerScore=new Array();
     var u=0;
     var v=0;
     var max=0;

     for( var i=0;i<15;i++){
        myScore[i]=new Array();
     	computerScore[i]=new Array();
          for( var j=0;j<15;j++){
             myScore[i][j]=0;
             computerScore[i][j]=0;
     	    }
     	
      }  
             
      for (var i = 0; i < 15; i++){
         for (var j = 0; j < 15; j++){

         	  if(board[i][j]==0){
         		  for(var k=0;k<count;k++){

                     if(wins[i][j][k]){
                        if(myWin[k]==1){
                         	myScore[i][j]+=200;
                         }
                        else if(myWin[k]==2){
                         	myScore[i][j]+=400;
                         }
                        else if(myWin[k]==3){
                         	myScore[i][j]+=2000;
                         } 
                         else if(myWin[k]==4){
                         	myScore[i][j]+=10000;
                         } 

                          if(computerWin[k]==1){
                         	computerScore[i][j]+=220;
                         }
                        else if(computerWin[k]==2){
                         	computerScore[i][j]+=420;
                         }
                        else if(computerWin[k]==3){
                         	computerScore[i][j]+=2200;
                         } 
                         else if(computerWin[k]==4){
                         	computerScore[i][j]+=20000;
                         } 
                      }     
                    } 
                    
         		  
                  if (myScore[i][j] > max){
                      max = myScore[i][j];
                      u = i;
                      v = j;
                 } else if (myScore[i][j] == max){
                      if (computerScore[i][j] > computerScore[u][v]){
                         u = i;
                         v = j;
                     }
                 }   
                 
                  if (computerScore [i][j] > max){
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                 } else if (computerScore[i][j] == max){
                     if (myScore[i][j] > myScore[u][v]){
                         u = i;
                         v = j;
                     }

         	     }
         	   }
            }
        }
       oneStep(u,v,false);
       board[u][v]=2;

       //修改赢法统计数组
       for( var k=0;k<count;k++){
	   	  if(wins[u][v][k]){
	   	  	 computerWin[k]++;
	   	     myWin[k]=8;
	   	     if(computerWin[k]==5){
	   	     	alert("计算机赢了");
	   	     	//init();
	   	        over=true;
	   	     }
	   	  }
	    }	
        if(!over){
           color=!color;
          }

 }


}


