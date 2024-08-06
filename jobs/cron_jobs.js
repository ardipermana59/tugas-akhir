const cron = require('node-cron')
const reportController = require('../controllers/report_controller')

// cron.schedule usage for various intervals:
// Every 1 second:   '* * * * * *'     
// Every 1 minute:   '* * * * *'     
// Every 5 minutes:  '*/5 * * * *' 
// Every 30 minutes: '*/30 * * * *'  
// Every 1 hour:     '0 * * * *'       
// Every 6 hours:    '0 */6 * * *'       
// Every 12 hours:   '0 */12 * * *'    
// Every 1 day:      '0 0 * * *' 
cron.schedule('* * * * * *', () => {
  reportController.suara()
})


