# linux-iot




## Setting up Devices

AWS IOT provides a device setup package which includes several certificates and boostrapping scripts. We currently need to rename the certificates to use them in our iot code. 

### Certificates 

Our iot scripts use the following certificates. 
```
certificate.pem.crt   --   Corresponds to <DeviceName>.cert.pem  in the AWS IOT setup package. 
private.pem.key       --   Corresponds to <DeviceName>.private.key
root-CA.crt           --   The AWS IOT root CA       
```

AWS root CA 
`curl https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem > root-CA.crt`


### Running the IOT code
Once you have the certificates renamed and placted in the device-scripts/certs directory you can start up the project. 
```
cd device-scripts
npm install
npm start
```
