// routes/helpers.js
'use strict'; 

// Module filled w/route-based helper functions 
module.exports = {


	responseJSON: function(data, bool) {
		return { success: bool, data: data }
	}

	

}