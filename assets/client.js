const button = document.getElementById('submit');
button.addEventListener('click', function(e) {
  const user = document.getElementById('user').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  var flag = 1;
  if(user=="" || password == "" || email=="" || mobile=="") {
     flag = 0;
     document.getElementById("err_msg").innerHTML = "<div id='user_failure'>Enter Your Details</div>";
  }
  
  var data = {name:user, email:email, mobile:mobile, password:password};
  if(flag==1) {
  fetch('/createUser', {method: 'POST',headers: {'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json'},dataType:'json', body:JSON.stringify(data)})
      .then(function(response) {
          return response.json();
       })   
      .then(function(myJson){
        console.log('response:',JSON.stringify(myJson));
        var res = JSON.stringify(myJson);
        var error_message = JSON.parse(res);
        if(error_message.status===200) {
          document.getElementById("err_msg").innerHTML = "<div id='user_success'>"+error_message.message+"</div>";
          getUsers();
          return;
        }
        else{
          document.getElementById("err_msg").innerHTML = "<div id='user_failure'>"+error_message.message+"</div>";
        }
        
      })
        .catch(function(error) {
          console.log(error);
          throw new Error('Request failed.');
        });
    }    
});
getUsers();
function getUsers() {
      fetch('/getUsers', {method: 'POST'})    
       .then(function(responce){
           return responce.json();
       })
       .then(function(myJson){
          var res = JSON.stringify(myJson);
          var result2 = JSON.parse(res);
          var users='';
          for(var i=0;i<result2.data.length;i++)
          { 
            
            users+= '<div class="col-md-3 users"><div class="name">'+result2.data[i].name+'</div><div class="email">'+result2.data[i].email+'</div><div class="mobile">'+result2.data[i].mobile+'</div><div id="buttons"><button class="btn btn-info btn-sm"><a  href="/user_details?id='+result2.data[i]._id+'">View</a></button><button class="btn btn-danger btn-sm" onclick=delete_users("'+result2.data[i].mobile+'")>Delete</button></div></div>'; 
          }
            document.getElementById("display_users").innerHTML = users;

      }) 
}
function delete_users(mobile) {
  var data = {mobile:mobile};
  
      var x = confirm("Are you sure you want to delete?");
      if (x) {
      fetch('/deleteUsers', {method: 'POST',headers: {'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},dataType:'json', body:JSON.stringify(data)})
      .then(function(responce) {
           return responce.json();
      })
      .then(function(myJson) {
        var res = JSON.stringify(myJson);
        var result3 = JSON.parse(res);
        if(result3.status===200) {
          document.getElementById("err_msg").innerHTML= "<div id='user_failure'>"+result3.message+"</div>";
          getUsers();
        } else {
          document.getElementById("err_msg").innerHTML = result3.message;
        }

      })
      } else { 
        return false;
      } 
     
}

  
