import { config } from 'dotenv/browser';
import Razorpay from 'razorpay';

config();

export const razorpay = new Razorpay({
  key_id: config().RAZORPAY_KEY_ID,
  key_secret: config().RAZORPAY_KEY_SECRET,
});