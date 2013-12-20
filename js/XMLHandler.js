/**
 * @author YasKa
 */

function getXMLDoc(xmlText) {
	if(window.DOMParser) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlText, "text/xml");

	} else// Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlText);
	}

	return xmlDoc;
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
		showMessage("ERROR>Command No:"+commandNo,xmlString);
		return false;
	}
}

function isNodeEqual(xmlString, nodeName, compareValue) {

	var xmlDoc = getXMLDoc(xmlString);
	var x = xmlDoc.getElementsByTagName("MESSAGE_RESPONSE");

	if(x.length > 0) {
		var s = x[0].getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
		if(s == compareValue)
			return true;
		else
			return false;

	} else
		return false;
}

function checkError(xmlData) {
	var xmlDoc = getXMLDoc(xmlData);
	var x = xmlDoc.getElementsByTagName("MESSAGE_RESPONSE");
	if(x.length > 0) {
		var res = x[0].getElementsByTagName("Error")[0].childNodes[0].nodeValue;
		if(res == "NO_ERROR")
			return "OK";
		else
			return "ERROR";
	} else {
		return "READ ERROR";
	}
}

//nodeName example: Satellite_Content
//commandNo is to check if the sent and received commands are the same.
function getXMLNodeList(xmlString, nodeName, commandNo) {

	if(!isResponseCorrect(xmlString, commandNo))
		return false;
	var xmlDoc = getXMLDoc(xmlString);
	var xmlNodeList = xmlDoc.getElementsByTagName(nodeName);
	return xmlNodeList;
}

function getNodeValue(node, childNodeName) {

	if(node == null) {
		console.log("parent node null>" + childNodeName);
		return "";
	}

	if(node.getElementsByTagName(childNodeName)[0] == null) {
		console.log("node null>" + childNodeName);
		return "";
	}

	//console.log(childNodeName);
	if(node.getElementsByTagName(childNodeName)[0].childNodes[0] == null)
		return "";
	else
		return node.getElementsByTagName(childNodeName)[0].childNodes[0].nodeValue;

}