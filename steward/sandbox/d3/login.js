var showLogin = function(changeLogin) {
  var chart, div, form, table, td, tr;
  
  if (!document.getElementById("logo")) {
    chart = document.getElementById('chart');
    div = document.createElement('div');
    div.setAttribute('id', 'logo');
    div.setAttribute('class', 'logo');
    img = document.createElement('img');
    img.setAttribute('src', 'images/thing.sys.logo.black.svg');
    div.appendChild(img);
    chart.appendChild(div);
  }
  
  div = d3.select("body")
  	.append("div")
  	.attr("id", "login")
  	.classed("form-container-short", true)
  	.style("display", "block")
  	.style("top", "-210px");
  form = div.append("form")
  	.attr("name", "loginForm")
  	.attr("action", "#");
  table = form.append("table")
    .classed("short-form", true);
    
  tr = table.append("tr");
  tr.append("td").text("Client ID:");
  tr.append("td")
  	.append("input")
  	  .attr("type", "text")
  	  .attr("name", "userName")
  	  .attr("autocorrect", "off")
  	  .attr("autocapitalize", "none");
  tr.append("td").text("e.g., \'root/1\'");
  
  tr = table.append("tr");
  tr.append("td").text("Login code:");
  tr.append("td")
  	.append("input")
  	  .attr("type", function() { return (isMobile()) ? "number" : "text" })
  	  .attr("name", "userCode")
  	  .attr("autocorrect", "off")
  	  .attr("onkeyup", "javascript:submitLogin(event)");
  tr.append("td").text("e.g., \'123456\'");

  tr = table.append("tr");
  td = tr.append("td")
  	.attr("colspan", "3")
    .style("text-align", "center");
  if (!isRemoteAccess()) {
    td.append("img")
  	    .attr("src", "popovers/assets/create-account.svg")
  	    .style("cursor", "pointer")
  	    .on("click", function() { window.location = "../client.html"; });
  }
  if (changeLogin) {
    if (!readOnlyAccess && !isRemoteAccess()) {
      td.append("img")
  	    .attr("src", "popovers/assets/read-only.svg")
  	    .style("cursor", "pointer")
  	    .on("click", function() { hideLogin(); switchToReadOnly(); });
  	}
    td.append("img")
  	  .attr("src", "popovers/assets/cancel-login.svg")
  	  .style("cursor", "pointer")
  	  .on("click", hideLogin);
  } else if (!isRemoteAccess()) {
    td.append("img")
  	  .attr("src", "popovers/assets/read-only.svg")
  	  .style("cursor", "pointer")
  	  .on("click", function() { hideLogin(); switchToReadOnly(); });
  }
  td.append("img")
  	  .attr("src", "popovers/assets/login.svg")
  	  .style("cursor", "pointer")
  	  .on("click", login);
  tr = table.append("tr")
    .append("td")
  	.attr("colspan", "3")
  	.style("text-align", "center")
  	.style("padding-bottom", "15px")
    .attr("id", "loginStatus")
    .html(function() { return (loginInfo.clientID !== '') ?
                       '<font color="green">logged in with Client ID: ' + loginInfo.clientID + '</font>' : '' });

  d3.select("#login")
    .style("top", "-240px")
    .transition()
    .duration(600)
    .style("top", "120px");
    
  if (document.getElementById('relogin')) document.getElementById('relogin').setAttribute('onclick', '');
  
  document.loginForm.userName.focus();
  
  function isRemoteAccess() {
    return (/\.taas\./.test(location.hostname));
  }
  
  function isMobile() {
    // looking only for iOS devices now
    return ((/iPhone/.test(navigator.userAgent)) || (/iPad/.test(navigator.userAgent)));
  }
};

var hideLogin = function() {
  d3.select("#login")
    .style("top", "120px")
    .transition()
    .duration(600)
    .style("top", "-240px")
    .remove();
  if (document.getElementById('relogin')) document.getElementById('relogin').setAttribute('onclick', 'javascript:showLogin(true)');
}

var submitLogin = function(evt) {
    if (evt.keyCode === 13) login();
}

var showReauth = function() {
  var chart, div, div2;
  if (document.getElementById('reauthenticator')) document.getElementById('chart').removeChild(document.getElementById('reauthenticator'));
  if (document.URL.indexOf("https://") === 0) {
    chart = document.getElementById("chart");
    div = document.createElement('div');
    div.setAttribute('class', 'reauthenticator');
    div.setAttribute('id', 'reauthenticator');
    chart.appendChild(div);
    div2 = document.createElement('div');
    div2.setAttribute('id', 'relogin');
    div2.setAttribute('class', 'relogin');
    div2.innerHTML = "CHANGE&nbsp;LOGIN";
    div2.setAttribute('onclick', 'javascript:showLogin(true)');
    div.appendChild(div2);
    if (loginInfo.permissions.length > 0) {
      div2 = document.createElement('div');
      div2.setAttribute('class', 'reauthenticator-text');
      div2.innerText = "Authorized for " + loginInfo.permissions.join("/") + ".";
      div.appendChild(div2);
    }
  }
}

var showSettings = function() {
  var btn, chkbox, div, div2, form, i, img, lbl, option, radio, select, settings, span, txtbox;
  
  if (document.getElementById('settings')) return;
  
  img = document.getElementById("to-config");
  img.disabled = true;
  img.style.opacity = 0.3;
  
  div = document.createElement('div');
  div.setAttribute('id', 'settings');
  
  form = document.createElement('form');
  form.setAttribute('id', 'place-form');
  
  div2 = document.createElement('div');
  div2.setAttribute('class', 'form-heading');
  div2.setAttribute('style', 'margin-top:0px');
  div2.innerHTML = "Steward Place Settings";
  form.appendChild(div2);
    
  form.appendChild(labeledBox('STEWARD NAME', 'stewardName', '', 50, ''));
  form.appendChild(labeledBox('STREET ADDRESS', 'physical', '', 70, ''));
  div2 = document.createElement('div');
  div2.setAttribute('class', 'big-instructions');
  div2.innerHTML = "Coordinates";
  btn = document.createElement('input');
  btn.setAttribute('type', 'image');
  btn.setAttribute('src', 'images/form-button-one-blue.svg');
  btn.setAttribute('value', 'Use Browser Geolocation');
  btn.setAttribute('style', 'float: right; margin-right: -10px;');
  btn.setAttribute('onclick', 'javascript:return geolocate()');
  div2.appendChild(btn);
  btn = document.createElement('input');
  btn.setAttribute('type', 'image');
  btn.setAttribute('src', 'images/form-button-two-blue.svg');
  btn.setAttribute('value', 'Use Geocoding from Street Address');
  btn.setAttribute('style', 'float: right;');
  btn.setAttribute('onclick', 'javascript:return geocode()');
  div2.appendChild(btn);
  form.appendChild(div2);
  
  div2 = document.createElement('div');
  div2.setAttribute('class', 'formtext-container-left');
  div2.setAttribute('style', 'margin-bottom: 20px');
  div2.appendChild(labeledBox('LATITUDE', 'latitude', '', 20, ''));
  form.appendChild(div2);
  
  div2 = document.createElement('div');
  div2.setAttribute('class', 'formtext-container-right');
  div2.setAttribute('style', 'margin-bottom: 20px');
  div2.appendChild(labeledBox('LONGITUDE', 'longitude', '', 20, ''));
  form.appendChild(div2);
  
  div.appendChild(form);

  form = document.createElement('form');
  form.setAttribute('id', 'units-form');

  div2 = document.createElement('div');
  div2.setAttribute('class', 'big-instructions');
  div2.innerHTML = "Display Units";
  form.appendChild(div2);

  select = document.createElement('select');
  select.setAttribute('id', 'displayUnits');
  select = addDisplayUnits(select);
  form.appendChild(select);

  span = document.createElement('span')
  span.setAttribute('id', 'units-instructions');
  span.innerHTML = "&larr; " + "Preferred unit of measurement for display";
  form.appendChild(span);
  
  div.appendChild(form);
  document.body.appendChild(div);

  form.appendChild(document.createElement('hr'));
  
  form = document.createElement('form');
  form.setAttribute('id', 'strict-form');

  div2 = document.createElement('div');
  div2.setAttribute('class', 'form-heading');
  div2.innerHTML = "Security Services";
  form.appendChild(div2);

  select = document.createElement('select');
  select.setAttribute('id', 'strictLAN');
  select = addStrict(select);
  form.appendChild(select);

  span = document.createElement('span')
  span.setAttribute('id', 'lan-instructions');
  span.innerHTML = "&larr; " + "Require secure connection over LAN for clients (disable if you are using Arduino-based clients)";
  form.appendChild(span);
  
  
  div.appendChild(form);
  document.body.appendChild(div);
  form.appendChild(document.createElement('hr'));

  div.appendChild(form);

  form = document.createElement('form');
  form.setAttribute('id', 'cloud-form');

  div2 = document.createElement('div');
  div2.setAttribute('class', 'form-heading');
  div2.innerHTML = "Cloud Services";
  form.appendChild(div2);

  select = document.createElement('select');
  select.setAttribute('id', 'bootableChoice');
  select = addBootables(select);
  form.appendChild(select);
  
  span = document.createElement('span')
  span.setAttribute('id', 'cloud-instructions');
  span.innerHTML = "&larr; " + bootable[select.value].text + " " + bootable[select.value].instructions;
  form.appendChild(span);
  
  var labelArray = labeledBoxes(select);
  for (i = 0; i < labelArray.length; i++) {
    form.appendChild(labelArray[i]);
  }
  
  btn = document.createElement('input');
  btn.setAttribute('type', 'image');
  btn.setAttribute('src', 'images/form-button-four-blue.svg');
  btn.setAttribute('value', 'Add Cloud Service');
  btn.setAttribute('style', 'float: right; margin-right: -10px; margin-top: 10px;');
  btn.setAttribute('onclick', 'javascript:return addCloud(event);');

  form.appendChild(btn);

  img = document.createElement('img');
  img.setAttribute('src', 'popovers/assets/done_on.svg');
  img.setAttribute('style', 'float: right; margin-right: -10px;  margin-top: 10px; clear: both;');
  img.setAttribute('onclick', 'javascript:return closeSettings(event);');
  form.appendChild(img);
  div.appendChild(form);
  document.body.appendChild(div);
  
  
  document.getElementById("stewardName").addEventListener('change', function(evt) {place_info.name = evt.target.value; savePlace(event); });
  document.getElementById("physical").addEventListener('change', function(evt) {place_info.physical = evt.target.value; savePlace(event); });
  document.getElementById("latitude").addEventListener('change', function(evt) {place_info.location[0] = evt.target.value; savePlace(event); });
  document.getElementById("longitude").addEventListener('change', function(evt) {place_info.location[1] = evt.target.value; savePlace(event); });
  document.getElementById("displayUnits").addEventListener('change', pickDisplayUnits);
  document.getElementById("strictLAN").addEventListener('change', pickStrict);
  document.getElementById("bootableChoice").addEventListener('change', pickBootable);

  fillPlaceFields();
    
  // Populate select element with strict mode choices
  function addStrict(select) {
    var optgroup, option;
    
    optgroup = document.createElement('optgroup');
    optgroup.setAttribute('label', 'Strict Mode');
    select.appendChild(optgroup);
    
    option = document.createElement('option');
    option.setAttribute('value', 'on');
    option.innerHTML = 'yes';
    optgroup.appendChild(option);
    option = document.createElement('option');
    option.setAttribute('value', 'off');
    option.innerHTML = 'no';
    optgroup.appendChild(option);
    return select;
  }
  
  // Populate select element with display unit choices
  function addDisplayUnits(select) {
    var optgroup, option;
    
    optgroup = document.createElement('optgroup');
    optgroup.setAttribute('label', 'Display Units');
    select.appendChild(optgroup);
    
    option = document.createElement('option');
    option.setAttribute('value', 'customary');
    option.innerHTML = 'customary';
    optgroup.appendChild(option);
    option = document.createElement('option');
    option.setAttribute('value', 'metric');
    option.innerHTML = 'metric';
    optgroup.appendChild(option);
    return select;
  }
  
  // Populate select element with networked product names
  function addBootables(select) {
    var optgroup, option;
    var keys = getKeys(bootable);
    
    optgroup = document.createElement('optgroup');
    optgroup.setAttribute('label', 'Choose a Service');
    select.appendChild(optgroup);

    for (var i = 0; i < keys.length; i++) {
      option = document.createElement('option');
      option.setAttribute('value', keys[i]);
      option.innerHTML = keys[i];
      optgroup.appendChild(option);
    }
    return select;
  }
  
}

var closeSettings = function(evt) {
  if (document.getElementById("settings")) document.body.removeChild(document.getElementById("settings"));
  stack = [];
  stack.push({ page: home });
  refreshActors(0);

  var img = document.getElementById("to-config");
  img.disabled = false;
  img.style.opacity = 1;
  
  return false;
}

var pickStrict = function(evt) {
  place_info.strict = evt.target.value || '';
  savePlace();
}

var pickDisplayUnits = function(evt) {
  place_info.displayUnits = evt.target.value || '';
  savePlace();
}

// Create pair of label & text input elements for networked products
var labeledBoxes = function(select) {
  var i, pwd = false;
  var choice = select.value;
  var keys = getKeys(bootable[choice].info);
  var labels = [];
  for (i = 0; i < keys.length; i++) {
    pwd = ['credentials', 'password', 'passphrase'].indexOf(keys[i]) >= 0;
    labels[i] = labeledBox(keys[i].toUpperCase(), 'bootChoice' + i, 'bootChoiceLabel' + i, 
      						 20, bootable[choice].info[keys[i]], pwd);
  }
  return labels;
}    
  // Create label & text input elements
var labeledBox = function(lblTxt, boxID, labelID, size, val, pwd) {
  var lbl, span, txtbox;
  
  lbl = document.createElement('label');
  lbl.setAttribute('for', boxID);
  lbl.setAttribute('id', labelID);
  span = document.createElement('span');
  span.innerHTML = lblTxt + ':&nbsp;&nbsp;';
  lbl.appendChild(span);
	
  txtbox = document.createElement('input');
  txtbox.setAttribute('type', (pwd) ? 'password' : 'text');
  txtbox.setAttribute('id', boxID);
  txtbox.setAttribute('class', 'formtext');
  txtbox.setAttribute('size', size);
  txtbox.setAttribute('value', val);
  txtbox.setAttribute('onchange', 'stowInfo()');
  lbl.appendChild(txtbox);
	  
  return lbl;
}

// Retrieve object keys for use as labels & select values
var getKeys = function(obj) {
  var keys = [];
  for(var k in obj) keys.push(k);
  return keys;
}

var pickBootable = function(evt) {
  var form, i, labelArray, oldLabels;
  document.getElementById("cloud-instructions").innerHTML = 
    "&larr; " + bootable[evt.target.value].text + " " + bootable[evt.target.value].instructions;
  form = document.getElementById("cloud-form");
  oldLabels = form.getElementsByTagName("label");
  for (i = oldLabels.length - 1; i >= 0; i--) {
    form.removeChild(oldLabels[i]);
  }
  
  var labelArray = labeledBoxes(evt.target).reverse();
  for (i = 0; i < labelArray.length; i++) {
    form.insertBefore(labelArray[i], document.getElementById("cloud-instructions").nextSibling);
  }
}

var stowInfo = function(evt) {
  var choice = document.getElementById("bootableChoice").value;
  var info = bootable[choice].info;
  var keys = Object.keys(info);
  for (var i = 0; i < keys.length; i++) {
    bootable[choice].info[keys[i]] = document.getElementById("bootChoice" + i).value;
  }
}

function geolocate() {
  navigator.geolocation.getCurrentPosition(
	function(pos) {
	  place_info.location = [ pos.coords.latitude, pos.coords.longitude ];
	  document.getElementById("latitude").value  = pos.coords.latitude;
	  document.getElementById("longitude").value = pos.coords.longitude;
	  savePlace();
	},
	function(err) {
	  switch (err.code) {
		case 1:
		  notify("Geolocation permission denied by user.");
		  break;
		case 2:
		  notify("Geolocation position unavailable.");
		  break;
		case 3:
		  notify("Geolocation service timed out.");
		  break;
		default:
		  notify("Geolocation position error:" + err.message);
	  }
	},
	{'enableHighAccuracy': false, 'timeout': 10000, 'maximumAge': 0});
	return false;

}

function geocode() {
  var physical = document.getElementById("physical");
  if (physical.value.length > 0) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
		var message, state;
	
		try {
		  if (this.readyState === 4) {
			message = JSON.parse(this.responseText);
			if (!message) throw new Error('invalid JSON: ' + this.responseText);
			if (message.status === 'OK') {
			  message = message.results[0];
			  physical.value = message.formatted_address;
			  place_info.physical = message.formatted_address;
			  place_info.location = [ message.geometry.location.lat, message.geometry.location.lng ];
			  document.getElementById("latitude").value  = message.geometry.location.lat;
			  document.getElementById("longitude").value = message.geometry.location.lng;
			  savePlace();
			  
			} else {
			  notify("Sorry, the address cannot be converted to coordinates.");
			}
		  }
		} catch(ex) { console.log(ex); }
	  }.bind(req);
	  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + physical.value.replace(/\s/g, "+") 
		   + '&sensor=false'
	  req.open('GET', url , true);
	  req.send(null);
  } else {
    notify("Please enter a street address.");
  }
  return false;
}


var fillPlaceFields = function() {
  var entry, keys;
  document.getElementById("stewardName").value = place_info.name = place.name || "";
  document.getElementById("physical").value = place_info.physical = place.info.physical || "";
  if (place.info.location) {
	  document.getElementById("latitude").value = place_info.location[0] = place.info.location[0] || "";
	  document.getElementById("longitude").value = place_info.location[1] = place.info.location[1] || "";
  }
  document.getElementById("displayUnits").value = place_info.displayUnits = place.info.displayUnits || "";
  document.getElementById("strictLAN").value = place_info.strict = place.info.strict || "";
}

var savePlace = function(evt) {
  var val = JSON.stringify({ path    : '/api/v1/actor/perform/place'
                         , requestID : "3"
                         , perform   : "set"
                         , parameter : JSON.stringify(place_info) || ''
                         });
  wsSend(val);
}

var addCloud = function(evt) {
  var emptyP = false, entry, i, val;
  var form = document.getElementById("cloud-form");
  var labels = form.getElementsByTagName("label");
  var name = document.getElementById("bootableChoice").value;
  var info = bootable[name].info;

  entry = bootable[name];
  for (prop in info) if ((info.hasOwnProperty(prop)) && (info[prop] === '')) emptyP = true;
  if (!emptyP) {
    val = JSON.stringify({ path      : '/api/v1/device/create/' + name
                         , requestID : "3"
                         , name      : name
                         , whatami   : entry.actor
                         , info      : info || {}
                         });
    wsSend(val);
    for (i = 0; i < labels.length; i++) {
      document.getElementById("bootChoice" + i).value = "";
      info[getKeys(info)[i]] = "";
    }
  }
  return false;
}

var place_info   = { name        : 'Home'
                   , physical    : ''
                   , location    : [ 39.50000, -98.35000 ]
                   , displayUnits: 'customary'
                   , strict      : 'on'
                   };

var bootable = { dweetio        :
                 { text         : 'The steward can automatically upload measurements to dweet.io'
                 , instructions : 'No account is necessary. The key is an optional identifier for your use.'
                 , site         : 'https://dweet.io/'
                 , icon         : ''
                 , name         : 'dweet'
                 , actor        : '/device/indicator/dweetio/sensor'
                 , info         :
                   { key        : ''
                   }
                 }
               , ecobee         :
                 { text         : 'If you have the Ecobee SmartSi thermostat, the steward can manage it for you.'
                 , instructions : 'Go to https://plus.google.com/communities/113042377519941328693 and ask for help, sorry!'
                 , site         : 'https://www.ecobee.com'
                 , icon         : ''
                 , name         : 'ecobee'
                 , actor        : '/device/gateway/ecobee/cloud'
                 , info         :
                   { appKey     : ''
                   }
                 }
               , 'flower power' :
                 { text         : 'If you have the Parrot Flower Power, the steward can manage it for you.'
                 , instructions : 'Enter your OAuth info, along with your Flower Power email address and password. To get OAuth info, go to https://apiflowerpower.parrot.com/api_access/signup.'
                 , site         : 'http://www.parrot.com/flowerpower'
                 , icon         : ''
                 , name         : 'flower-power'
                 , actor        :'/device/gateway/flower-power/cloud'
                 , info         :
                   { accessID   : ''
                   , accessSecret : ''
                   , email      : ''
                   , passphrase : ''
                   }
                 }
               , koubachi       :
                 { text         : 'If you have the Koubachi plant sensor, the steward can automatically update you with alerts, etc.'
                 , instructions : 'Go to http://labs.koubachi.com and sign up. You will get back an appkey and credentials to fill-in below.'
                 , site         : 'https://mykoubachi.com'
                 , icon         : ''
                 , name         : 'koubachi'
                 , actor        : '/device/gateway/koubachi/cloud'
                 , info         :
                   { appkey     : ''
                   , credentials: ''
                   }
                 }
               , lockitron      :
                 { text         : 'If you have a Lockitron account, the steward can let you lock and unlock your locks'
                 , instructions : 'Go to https://api.lockitron.com, create an account, and generate an accessToken.'
                 , site         : 'https://api.lockitron.com/'
                 , icon         : ''
                 , name         : 'lockitron'
                 , actor        : '/device/gateway/lockitron/cloud'
                 , info         :
                   { accessToken: ''
                   }
                 }
               , mqtt           :
                 { text         : 'If you have an account on an MQTT broker, the steward can automatically upload measurements.'
                 , instructions : 'Enter a URL, e.g., "mqtts://broker/topic" and your username/password for the broker'
                 , site         : ''
                 , icon         : ''
                 , name         : 'mqtt'
                 , actor        : '/device/indicator/text/mqtt'
                 , info         :
                   { url        : ''
                   , username   : ''
                   , password   : ''
                   }
                 }
               , nest           :
                 { text         : 'If you have the Nest thermostat, the steward can manage it for you.'
                 , instructions : 'Enter your email address and password.'
                 , site         : 'https://home.nest.com'
                 , icon         : ''
                 , name         : 'nest'
                 , actor        : '/device/gateway/nest/cloud'
                 , info         :
                   { email      : ''
                   , passphrase : ''
                   }
                 }
               , netatmo        :
                 { text         : 'If you have the Netatmo weather station, the steward can manage it for you.'
                 , instructions : 'Enter your email and password.'
                 , site         : 'https://my.netatmo.com'
                 , icon         : ''
                 , name         : 'netatmo'
                 , actor        :'/device/gateway/netatmo/cloud'
                 , info         :
                   { email      : ''
                   , passphrase : ''
                   }
                 }
               , nma            :
                 { text         : 'If you have a Notify my Android account, the steward can automatically update you with alerts, etc.'
                 , instructions : 'Go to http://www.notifymyandroid.com, create an account, and generate an API key.'
                 , site         : 'https://www.notifymyandroid.com/login.php'
                 , icon         : ''
                 , name         : 'nma'
                 , actor        : '/device/indicator/nma/text'
                 , info         :
                   { apikey     : ''
                   }
                 }
               , prowl          :
                 { text         : 'If you have a Prowl account, the steward can automatically update you with alerts, etc.'
                 , instructions : 'Go to http://www.prowlapp.com, create an account, and generate an API key.'
                 , site         : 'https://prowlapp.com/login.php'
                 , icon         : ''
                 , name         : 'prowler'
                 , actor        : '/device/indicator/prowl/text'
                 , info         :
                   { apikey     : ''
                   }
                 }
               , tesla          :
                 { text         : 'If you have the Tesla Model S, the steward can manage it for you.'
                 , instructions : 'Enter your email address and password.'
                 , site         : 'https://teslamotors.com/mytesla'
                 , icon         : ''
                 , name         : 'tesla'
                 , actor        : '/device/gateway/tesla/cloud'
                 , info         :
                   { email      : ''
                   , passphrase : ''
                   }
                 }
               , wink           :
                 { text         : 'If you have one or more Quirky smart devices, the steward can manage them for you.'
                 , instructions : 'Enter your OAuth info, along with your Wink email and password. To get OAuth info, send an email to questions@quirkyinc.com.'
                 , site         : 'http://www.quirky.com'
                 , icon         : ''
                 , name         : 'netatmo'
                 , actor        :'/device/gateway/wink/cloud'
                 , info         :
                   { clientID   : ''
                   , clientSecret : ''
                   , email      : ''
                   , passphrase : ''
                   }
                 }
               , xively         :
                 { text         : 'If you have an Xively (nee cosm) account, the steward can automatically upload measurements.'
                 , instructions : 'Go to https://xively.com/login, create an account, and get a device key (apikey) and feed.'
                 , site         : 'https://xlively.com/login'
                 , icon         : ''
                 , name         : 'xively'
                 , actor        : '/device/indicator/xively/sensor'
                 , info         :
                   { apikey     : ''
                   , feed       : ''
                   }
                 }
               };
