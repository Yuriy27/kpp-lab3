let map;

function initMap() {
    const mapDiv = $('#map')[0];
    map = new google.maps.Map(mapDiv, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

function keyPressedHandler($event) {
    if ($event.keyCode === 13) {
        searchIP();
    }
    const isAllowedInput = ($event.key >= '0' && $event.key <= '9') || $event.key === '.';
    if (!isAllowedInput) {
        $event.preventDefault();        
    }
}

function isValidIP(ip) {
    const regex = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
    const res = ip.match(regex);

    return res !== null;
}

function searchIP() {
    const ip = $('#ip-search-input').val();
    if (!isValidIP(ip)) {
        alert('invalid ip');
        return;
    }
    fetch(`http://api.ipstack.com/${ip}?access_key=8bce1b5e90e0fead6704a4ce7191fc75`)
        .then(response => {
            response.json().then(data => {
                const center = new google.maps.LatLng(data.latitude, data.longitude);
                const marker = new google.maps.Marker({
                    position: center,
                    map: map,
                    title: 'Hello World!'
                  });
                attachIPInfo(marker, data);
                map.panTo(center);
                console.log(map);
                console.log(data);
            });
        });
    
    
}

function attachIPInfo(marker, data) {
    let html = `<h2>${data.ip} <img class="country-flag-img" src="${data.location.country_flag}"></h2>`;
    const propsHtml = {
        'country_name': `<h4>Country: ${data.country_name}</h4>`,
        'city': `<h4>City: ${data.city}</h4>`,
        'country_code': `<h4>Country code: ${data.country_code}</h4>`,
        'zip': `<h4>Zip: ${data.zip}</h4>`
    };
    const keys = ['country_name', 'city', 'country_code', 'zip'];
    keys.forEach(key => {
        if (data[key] !== null) {
            html += propsHtml[key];
        }
    });
    const info = new google.maps.InfoWindow({
        content: html
    });
    marker.addListener('click', () => info.open(marker.get('map'), marker));
    info.open(marker.get('map'), marker);
}