
var motorized=true;
var directionMode = "AUTOMATIC";
//LOAD SATELLITES

var currentSatellite;

var localStorageKey = "deviceIP";

function showStoreValue() {
            var item = localStorage.getItem(localStorageKey);
            if (item == null) {
                item = 'no IP found';
            }
            else if (item.length === 0) {
                item = 'IP is empty';
            }
            $('.storeItem').text(item);
        }

$(document).ready(function(){

    //reguestSatList(processSatList);
	
	//getSatellites();
    
	$("#goUp").bind('touchstart', function(event){ moveAzElPol('AZ_STOP','EL_UP','POL_STOP');});
	$("#goUp").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});
	
	$("#goDown").bind('touchstart', function(event){ moveAzElPol('AZ_STOP','EL_DOWN','POL_STOP');});
	$("#goDown").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});
	
	$("#goLeft").bind('touchstart', function(event){ moveAzElPol('AZ_CCW','EL_STOP','POL_STOP');});
	$("#goLeft").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});

	$("#goRight").bind('touchstart', function(event){ moveAzElPol('AZ_CW','EL_STOP','POL_STOP');});
	$("#goRight").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});
		
	$("#goCW").bind('touchstart', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_CW');});
	$("#goCW").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});
	
	$("#goCCW").bind('touchstart', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_CCW');});
	$("#goCCW").bind('touchend', function(event){ moveAzElPol('AZ_STOP','EL_STOP','POL_STOP');});
	
	//startReading();
	//$("#txtIP").val(getCookie("IP"));
	
	if (Modernizr.localstorage) {
                
			var item = localStorage.getItem(localStorageKey);
            if (item == null) {
                item = 'Nothing in store';
            }
            else if (item.length === 0) {
                item = 'Store contains empty value';
            }
			$("#txtIP").val(item);
			
            }
            else {
			
			alert("your browser doesn't support local storage");
			
                $("#message").text("your browser doesn't support local storage");
                //$("#addToStorage').attr("disabled", "disabled");
                //$("#message").show();
            }
			
			
            $('#addToStorage').click(function(e) {
                
            });
	
});//document ready ends


function getSatellites()
{
    var command = "<MESSAGE><Command_No>2</Command_No></MESSAGE>";
	request(processGetSatellites,command);
}

function processGetSatellites(xml)
{
	if(isResponseCorrect(xml, 2)) {
	
	$(xml).find('Satellite_Content').each(
		    
			function(){//function starts
	           
		    	var satName = $(this).find('sat_name').text(); 
	            var ew = $(this).find('sat_longitude_ew').text();
	         
	           //$("<li></li>").html("<a href='#main' data-direction='reverse' data-transition='slide'>"+satName + ", " + ew+"</a>").appendTo("#satList");
	           //$("<li></li>").html("<a href='#main' data-direction='reverse' data-transition='slide'>a</a>").appendTo("#satList");
	         
	            $("<li></li>").html("<a href='#main' data-direction='reverse' data-transition='slide'>"+satName + ", " + ew+"</a>").
	            data("satInfo", {
	    			sat_name : $(this).find('sat_name').text(),
	    			longitude : $(this).find('sat_longitude').text(),
	    			polarization : $(this).find('polarity').text(),
	    			longitude_EW : $(this).find('sat_longitude_ew').text(),
	    			diseqc : $(this).find('tun_22khz').text(),
	    			lnb_power : $(this).find('lnb_power').text(),
	    			dvbs_s2 : $(this).find('dvb').text(),
	    			ku_band_freq :$(this).find('kuband_freq').text(),
	    			symbol_rate : $(this).find('symbol_rate').text(),
	    			local_osc : $(this).find('local_osc').text()
	    		}).bind("click", function() {selectSat($(this).data("satInfo"));}).appendTo("#satList");
	            
              }//function ends
	        );//each ends
	//
	}
}
		    

function selectSat(satData)
{
	//$("#txtCurrentSatellite").val(satData.longitude_EW+"-"+satData.sat_name);
	
    //if gotosatellite() is used we need this.
	//currentSatellite= satData;   
	
	if(motorized)
		flyawayType = "MOTORIZED";
	else
		flyawayType = "NON_MOTORIZED";
	var command = "<MESSAGE><Command_No>14</Command_No>";
	command += "<START_SATELLITE_DIRECTION>";
	command += "<sat_longitude>" + satData.longitude + "</sat_longitude>";
	command += "<sat_longitude_ew>" + satData.longitude_EW + "</sat_longitude_ew>";
	command += "<polarity>" + satData.polarization + "</polarity>";
	command += "<sat_skew_angle>0</sat_skew_angle>";
	command += "<tun_22khz>" + satData.diseqc + "</tun_22khz>";
	command += "<lnb_power>" + satData.lnb_power + "</lnb_power>";
	command += "<dvb>" + satData.dvbs_s2 + "</dvb>";
	command += "<kuband_freq>" + satData.ku_band_freq + "</kuband_freq>";
	command += "<symbol_rate>" + satData.symbol_rate + "</symbol_rate>";
	command += "<local_osc>" + satData.local_osc + "</local_osc>";
	command += "<system_type>" + flyawayType + "</system_type>";
	command += "<direction_mode>" + directionMode + "</direction_mode>";
	command += "</START_SATELLITE_DIRECTION>";
	command += "</MESSAGE>";
	
	requestDelayed(processLookAngleXML, command);
	
}


//START_SATELLITE_DIRECTION

function startDirectingToSatellite()
{
	//alert("direction start is ok.")
	
	//$("#lnkSelectSatellite").bind('click',stopDirectionToSatellite);
	//$("#lnkSelectSatellite").text("Stop");
			
	if(currentSatellite==null) alert("No satellite selected.")
	satData = currentSatellite;
	
	if(motorized)
		flyawayType = "MOTORIZED";
	else
		flyawayType = "NON_MOTORIZED";
	
	var command = "<MESSAGE><Command_No>14</Command_No>";
	command += "<START_SATELLITE_DIRECTION>";
	command += "<sat_longitude>" + satData.longitude + "</sat_longitude>";
	command += "<sat_longitude_ew>" + satData.longitude_EW + "</sat_longitude_ew>";
	command += "<polarity>" + satData.polarization + "</polarity>";
	command += "<sat_skew_angle>0</sat_skew_angle>";
	command += "<tun_22khz>" + satData.diseqc + "</tun_22khz>";
	command += "<lnb_power>" + satData.lnb_power + "</lnb_power>";
	command += "<dvb>" + satData.dvbs_s2 + "</dvb>";
	command += "<kuband_freq>" + satData.ku_band_freq + "</kuband_freq>";
	command += "<symbol_rate>" + satData.symbol_rate + "</symbol_rate>";
	command += "<local_osc>" + satData.local_osc + "</local_osc>";
	command += "<system_type>" + flyawayType + "</system_type>";
	command += "<direction_mode>" + directionMode + "</direction_mode>";
	command += "</START_SATELLITE_DIRECTION>";
	command += "</MESSAGE>";
	
	alert(command);
	requestDelayed(processLookAngleXML, command);
}

function moveAzElPol(az, el, pol) {
	var command = "<MESSAGE><Command_No>21</Command_No><MOVEMENT>"
	command += "<Az>" + az + "</Az>";
	command += "<El>" + el + "</El>";
	command += "<Pol>" + pol + "</Pol>";
	command += "<Max_Pwm>255</Max_Pwm>";
	command += "</MOVEMENT>";
	command += "</MESSAGE>";

	request(processGotoAngles, command);
}

function processGotoAngles(xmlString) {

}

function processLookAngleXML(data) {

	//return false;
	//alert(data);
	//startReading();

	if(isResponseCorrect(data, 14)) {

		var xmlDoc = getXMLDoc(data);
		var x = xmlDoc.getElementsByTagName("SATELLITE_DIRECTION_DATA");
		//alert(x.length);
		if(x.length > 0) {

		var az_angle = x[0].getElementsByTagName("az_look_angle")[0].childNodes[0].nodeValue;
		var el_angle = x[0].getElementsByTagName("el_look_angle")[0].childNodes[0].nodeValue;
		var pol_angle = x[0].getElementsByTagName("pol_look_angle")[0].childNodes[0].nodeValue;

			//var ebno = x[0].getElementsByTagName("eb_n0")[0].childNodes[0].nodeValue;

			//alert(az_angle);

			/*$("#txtCurrentAzimuth").val();
			 $("#txtCurrentElevation").val();*/

			/*document.getElementById("txtTargetAzimuth").value = az_angle;
			document.getElementById("txtTargetElevation").value = el_angle;
			document.getElementById("txtTargetPolarization").value = pol_angle;*/

			if(az_angle == "undefined")
				alert("az angle error.");
			//changeEbnoLevel(ebno);
		}
	} else
		alert(data);
	//else startDirectingToSatellite(currentSatNo);
	//startReadingManual();
}

function stopDirectingToSatellite()
{
	var command = "<MESSAGE><Command_No>16</Command_No></MESSAGE>";
	request(processStopDirecting, command);
}

function processStopDirecting(data)
{
	if(isResponseCorrect(data, 16)) {
		//$("#txtCurrentSatellite").val("");
		//$("#lnkSelectSatellite").text("Go To Satellite")
		//currentSatellite=null;
	}
	
}

// UTILITY FUNCTIONS

function requestDelayed(handlerFunction, command) {
	setTimeout(request, 1000, handlerFunction, command);
}


function requestSatList(handlerFunction) {
	//alert(handlerFunction+"waited.");
	$.ajax({
		type : 'POST',
		async:false,
		url : 'all_satellites.xml',
		success : handlerFunction
	});
}
	
function isResponseCorrect(xmlString, commandNo) {

	//showMessage("ERROR>Command No:"+commandNo,xmlString);
	
	var xmlDoc = getXMLDoc(xmlString);
	var x = xmlDoc.getElementsByTagName("MESSAGE_RESPONSE");

	if(x.length > 0) {
		var s = x[0].getElementsByTagName("Command_No")[0].childNodes[0].nodeValue;
		if(s == commandNo)
			return true;
		else
			return false;

	} else
	{
		alert("ERROR>Command No:"+commandNo,xmlString);
		return false;
	}
}

function FlyawayStatus() {

	FlyawayStatus.prototype.getStatus = function() {
		var command = "<MESSAGE><Command_No>1</Command_No></MESSAGE>";
		request(processStatus, command)
}
	
	
function processStatus(xmlString) {

		if(isResponseCorrect(xmlString, 1)) {

			this.Error = false;

			var x = getXMLNodeList(xmlString, "SYSTEM_DATA", 1);
			if((x != false) && (x.length > 0)) {
				
				

				Status.az_angle = getNodeValue(x[0], "az_angle");

				Status.el_angle = getNodeValue(x[0], "el_angle");
				Status.pol_angle = getNodeValue(x[0], "pol_angle");
				Status.az_count = getNodeValue(x[0], "az_count");
				Status.el_count = getNodeValue(x[0], "el_count");
				Status.pol_count = getNodeValue(x[0], "pol_count");

				Status.signal_level = getNodeValue(x[0], "signal_level");
				
				
				Status.auto_pointing_message = getNodeValue(x[0],"auto_pointing_message");
				Status.system_error_message = getNodeValue(x[0],"system_error_message");

				var y = getXMLNodeList(xmlString, "instant_system_data_bit_status", 1);
				Status.carrier_lock = getNodeValue(y[0], "carrier_lock");

				Status.az_cw_limit = getNodeValue(x[0], "az_cw_limit");
				Status.az_ccw_lLimit = getNodeValue(x[0], "az_ccw_limit");

				Status.pol_cw_Limit = getNodeValue(x[0], "pol_cw_limit");
				Status.pol_ccw_Limit = getNodeValue(x[0], "pol_ccw_limit");

				//SPEED
				Status.driver_unit_current_az_pwm = Number(getNodeValue(x[0], "driver_unit_current_az_pwm"));
				Status.driver_unit_current_el_pwm = Number(getNodeValue(x[0], "driver_unit_current_el_pwm"));
				Status.driver_unit_current_pol_pwm = Number(getNodeValue(x[0], "driver_unit_current_pol_pwm"));

				///PROCESSS DIRECTING INFO SECTION STARTS

				//x = getXMLNodeList(xmlString, "nonmotorized_satellite_direction_instructions", 1);

				Status.is_satellite_direction_in_progress = getNodeValue(x[0], "is_satellite_direction_in_progress");
				//YES,NO
				Status.is_antenna_in_search_area = getNodeValue(x[0], "is_antenna_in_search_area");
				//document.getElementById("directingHelp").innerHTML =
				//"Directing Instruction:" + getNodeValue(x[0], "az_direction_instruction")+","+getNodeValue(x[0], "pol_direction_instruction")+","+getNodeValue(x[0], "el_direction_instruction");

				Status.az_direction_instruction = getNodeValue(x[0], "az_direction_instruction");
				
				//AZ_GOTO_CW,AZ_GOTO_CCW,AZ_STOP
				Status.el_direction_instruction = getNodeValue(x[0], "el_direction_instruction");
				//EL_GOTO_CW,EL_GOTO_CCW,EL_STOP
				Status.pol_direction_instruction = getNodeValue(x[0], "pol_direction_instruction");
				//POL_GOTO_CW,POL_GOTO_CCW,POL_STOP

				///PROCESSS DIRECTING INFO SECTION ENDS

				//MOTOR CONTROL SECTION
				Status.az_motor_drive_direction = getNodeValue(x[0], "az_motor_drive_direction");
				Status.el_motor_drive_direction = getNodeValue(x[0], "el_motor_drive_direction");
				Status.pol_motor_drive_direction = getNodeValue(x[0], "pol_motor_drive_direction");

				var y = getXMLNodeList(xmlString, "driver_unit_system_status", 1);

				Status.az_cw_limit = getNodeValue(y[0], "az_cw_limit");
				//true, false
				Status.az_ccw_limit = getNodeValue(y[0], "az_ccw_limit");
				//true, false
				Status.pol_cw_limit = getNodeValue(y[0], "pol_cw_limit");
				//true, false
				Status.pol_ccw_limit = getNodeValue(y[0], "pol_ccw_limit");
				//true, false
				Status.el_up_limit = getNodeValue(y[0], "el_up_limit");
				//true,false
				Status.el_down_limit = getNodeValue(y[0], "el_down_limit");
				//true,false
				Status.az0_limit = getNodeValue(y[0], "az0_limit");
				//true,false

				///MOTOR CONTROL SECTION ENDS

			}
			else
				alert("process status response is not correct");
		}
	}

}

function stow() {
	var command = "<MESSAGE><Command_No>28</Command_No></MESSAGE>";
	request(processStaw, command);
}

function processStaw(xmlString) {

}



function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}
