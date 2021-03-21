const express = require("express");
const app = express();
const cors = require('cors')
const nodeGeocoder = require('node-geocoder');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// PORT
app.use(cors())
const PORT = process.env.PORT || 4000;
app.post("/adminlocation", async (req, res) => {
    console.log('bosdy', req.body)
    let adminLocation = req.body.admincity
    let options = {
        provider: 'openstreetmap'
    };
    let geoCoder = nodeGeocoder(options);
    let data = await geoCoder.geocode(adminLocation);
    res.send({ data })

});
app.post("/check", async (req, res) => {
    let userLocation = req.body.usercity
    let adminLocation = req.body.admincity

    let options = {
        provider: 'openstreetmap'
    };
    let geoCoder = nodeGeocoder(options);
    let data = await geoCoder.geocode(userLocation);
    let useadd = data[0]
    const distance = getDistance(adminLocation, useadd)
    console.log('dddddd', distance)
    res.send(distance)

});
getDistance = (adminadd, useradd) => {
    console.log('getDistance', adminadd, useradd)

    //Get values of our inputs
    let lat1 = adminadd.latitude;
    let lon1 = adminadd.longitude;
    let lat2 = useradd.latitude;
    let lon2 = useradd.longitude;
    // Radius of earth, KM 
    let radiusOfEarth = 6357;
    let lattitudeDifference = lat2 - lat1;
    let dLat = toRad(lattitudeDifference);
    let longitudeDifference = lon2 - lon1;
    let dLon = toRad(longitudeDifference);
    /*
    a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
    c = 2 ⋅ atan2( √a, √(1−a) )
    d = R ⋅ c
    where	φ is latitude, λ is longitude, R is earth’s radius
    Assumes that the earth radius is 6,371 KM
    */

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = radiusOfEarth * c;
    distance = parseFloat(distance).toFixed(2);
    let distanceInMiles = 0.62137119 * distance
    distanceInMiles = parseFloat(distanceInMiles).toFixed(2);

    console.log('distance', distance)
    console.log('distanceInMiles', distanceInMiles)
    return data = { distance, distanceInMiles }
}
function toRad(degrees) {
    return degrees * Math.PI / 180;
  }
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});