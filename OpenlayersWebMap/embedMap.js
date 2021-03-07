window.onload = init; // makes sure init is called once window is fully loaded
const doctors = [
    {
        name: "Ivan Newton",
        id: 1,
        gender: "M",
        specialty: "Allergy & Immunology",
        location: [-123.157091, 49.264044],
        address: "2291 West Broadway, Vancouver, BC, Canada",
        contact: "604-398-8247",
        insurance: ["Pacific Blue Cross", "Aetna", "InsuranceGotU"]
    },
    {
        name: "Sarah Smith",
        id: 2,
        gender: "F",
        specialty: "Obstetrics & Gynecology",
        location: [-123.153016, 49.262836],
        address: "2120 West 10th Ave, Vancouver, BC, Canada",
        contact: "604-234-4509",
        insurance: ["Aetna"]
    },
    {
        name: "Hack Athon",
        id: 3,
        gender: "F",
        specialty: "Obstetrics & Gynecology",
        location: [-123.126505, 49.265124],
        address: "1038 West 7th Ave, Vancouver, BC, Canada",
        contact: "604-902-0343",
        insurance: []
    }];
/*const fs = require('fs');
const {Pool} = require('pg');

// Connect to the database.
const pool = new Pool ({
    user: 'charu',
    password: 'rDsCWKwrMwy0YfeE',
    host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    database: 'herhealth',
    port: 26257,
    ssl: {
        ca: fs.readFileSync('free-tier.gcp-us-central1').toString()
    }
});
const getName = (request, response) => {
    pool.query('SELECT * FROM doctors', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
module.exports = {
    getName
}*/

class DoctorInfo {
    name;
    medID;
    gender;
    location;
    address;
    contact;
    specialty;
    insurance;

    constructor(doctor) {
        this.name = doctor["name"];
        this.medID = doctor["id"];
        this.gender = doctor["gender"];
        this.location = doctor["location"];
        this.address = doctor["address"];
        this.contact = doctor["contact"];
        this.specialty = doctor["specialty"];
        this.insurance = doctor["insurance"];
    }
}

class Info {
    static getDoctors(database) {
        let listOfDocs = [];
        for (doctor of database) {
            let currDoc = new DoctorInfo(doctor);
            listOfDocs.push(currDoc);
        }
        return listOfDocs;
    }

    static getInfo(doctor, currLocation) {
        let docInfo = {};
        if (this.withinDist(doctor, currLocation)) {
            docInfo["name"] = doctor["name"];
            docInfo["gender"] = doctor["gender"];
            docInfo["address"] = doctor["address"];
            docInfo["contact"] = doctor["contact"];
            docInfo["specialty"] = doctor["specialty"];
            docInfo["insurance"] = doctor["insurance"];
        }
        return docInfo;
    }

    static calculateLonLat(loc) {
        let currLoc = ol.proj.transform(loc, "EPSG:3857", "EPSG:4326");
        let currLon = currLoc[0].toFixed(3);
        currLon = parseFloat(currLon);
        let currLat = currLoc[1].toFixed(3);
        currLat = parseFloat(currLat);
        currLoc = [currLon, currLat];
        return currLoc;
    }

    static withinDist(doctor, currLocation) {
        let maxDist = 5;
        let docLon = this.changeToRad(doctor["location"])[0];
        let docLat = this.changeToRad(doctor["location"])[1];
        let currLon = this.changeToRad(currLocation)[0];
        let currLat = this.changeToRad(currLocation)[1];

        let dist = 3963.0 * Math.acos((Math.sin(currLat) * Math.sin(docLat)) +
            Math.cos(currLat) * Math.cos(docLat) * Math.cos(docLon-currLon));

        return (dist*1.609344 < maxDist);
    }

    static changeToRad(location) {
        let convertedLocation = [];
        let lon = location[0];
        lon = lon / (180 / Math.PI);
        let lat = location[1];
        lat = lat / (180 / Math.PI);
        convertedLocation.push(lon, lat);
        return convertedLocation;
    }
}

function init() {
    let currLocation = [-123.155342, 49.263421];
    const map = new ol.Map({
        view: new ol.View({ // where and how the user will view the map
            center: ol.proj.fromLonLat(currLocation),
            zoom: 15,
            maxZoom: 18.5
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map'
    });
    let displayedDocs = [];
    for (let doctor of doctors) {
        if (Info.withinDist(doctor, currLocation)) {
            let layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat(doctor["location"]))
                        })
                    ]
                })
            });
            displayedDocs.push(doctor);
            map.addLayer(layer);
        }
    }
    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');

    let overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);

    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    map.on('singleclick', function (event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            var coordinate = event.coordinate;
            let docName;
            let docAddress;
            let docContact;
            for (let doctor of displayedDocs) {
                let docLonLat = ol.proj.fromLonLat(doctor["location"]);
                docLonLat = Info.calculateLonLat(docLonLat);
                console.log(docLonLat);
                let coordCopy = Info.calculateLonLat(coordinate);
                console.log(coordCopy);
                if (docLonLat[0] === coordCopy[0] && docLonLat[1] === coordCopy[1]) {
                    docName = doctor["name"];
                    docAddress = doctor["address"];
                    docContact = doctor["contact"];
                }
            }
            content.innerHTML = docName.bold() + '<br />' + docAddress + '<br />' + docContact;
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });
    let finalStr = "";
    let counter = 1;
    for (let doctor of displayedDocs) {
        let counterStr = counter.toString() + ".";
        finalStr = finalStr + '<br/>' + counterStr.bold() + " Dr. ".bold() + doctor["name"].bold() + '<br/>'
            + "MedicalID: " + doctor["id"] + '<br/>' + "Gender: " + doctor["gender"] + '<br/>' + "Specialty: "
            + doctor["specialty"] + '<br/>' + "Accepted Insurance: " + doctor["insurance"];
        counter++;
    }
    document.getElementById("docsNearby").innerHTML = finalStr;
}