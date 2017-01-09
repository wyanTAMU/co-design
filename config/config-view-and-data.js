/////////////////////////////////////////////////////////////////////
// Server config file for view-and-data package
//
/////////////////////////////////////////////////////////////////////

module.exports = {

  credentials: {

    ConsumerKey: process.env.LMV_CONSUMERKEY || 'xxxxxxxxxxxxxxxxxxx', //Replace 'xxxxxxxxxxxxxxxxxxx' Your own ConsumerKey 
    ConsumerSecret: process.env.LMV_CONSUMERSECRET || 'xxxxxxxxxxxx' //Replace 'xxxxxxxxxxxx' with your own ConsumerSecret
  }
}
