import 'dotenv/config'

export const firebaseConfig = {
  type: 'service_account',
  project_id: 'smart-funds',
  private_key_id: "8691bc5140d398d6182a786775d69f19d9bbc8ab",
  private_key:process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), 
  client_email:  "firebase-adminsdk-dgdfk@smart-funds.iam.gserviceaccount.com",
  client_id:  "111296440776282167248",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dgdfk%40smart-funds.iam.gserviceaccount.com"
};
export const databaseURL= "https://smart-funds-default-rtdb.asia-southeast1.firebasedatabase.app"
// export default firebaseConfig;
