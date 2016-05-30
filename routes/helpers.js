// routes/helpers.js
'use strict'; 

// Module filled w/route-based helper functions 
module.exports = {


	responseJSON: function(data, bool) {
		var resp = { success: bool }; 
		if (data != null) {
			resp.data = data; 
		}
		return resp; 
	}

	

}