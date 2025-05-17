/**
 * Twilio Authentication Middleware
 * Validates that incoming webhook requests are coming from Twilio
 */
const twilio = require('twilio');

const validateTwilioRequest = (req, res, next) => {
  // Skip validation in development if flag is set
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_TWILIO_AUTH === 'true') {
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  
  // Validate that the request is coming from Twilio
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  );
  
  if (isValid) {
    next();
  } else {
    console.warn('Invalid Twilio request signature');
    res.status(403).send('Forbidden: Invalid Twilio signature');
  }
};

module.exports = validateTwilioRequest;