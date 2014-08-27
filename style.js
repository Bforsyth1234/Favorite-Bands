var app = {};
app.url = "https://favoritebands.firebaseio.com/";
app.bands = [];

app.Band = function (name, song, year) {
    this.name = name;
    this.song = song;
    this.year = year;
};

app.output = function () {
    var holder = "";
    for (var i in app.bands) {
        holder += "<tr>";
        holder += "<td>" + app.bands[i].name + "</td>";
        holder += "<td>" + app.bands[i].song + "</td>";
        holder += "<td>" + app.bands[i].year + "</td>";
        holder += "</ tr>";
    }
    document.getElementById("output").innerHTML = holder;

};

app.create = function () {
    var name = document.getElementById("name").value;
    var song = document.getElementById("song").value;
    var year = document.getElementById("year").value;

    var band = new app.Band(name, song, year);

    var request = new XMLHttpRequest();

    request.open("POST", app.url + ".json");
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            band.key = JSON.parse(this.response).name;
            app.bands.push(band);
            app.output();
        } else {
            console.log("error on POST");
        };
    };
    request.onerror = function () {
        console.log("Error Communication");
    }
    request.send(JSON.stringify(band));


    document.getElementById("name").value = "";
    document.getElementById("song").value = "";
    document.getElementById("year").value = "";
};
app.read = function () {
    var request = new XMLHttpRequest();
    request.open("GET", app.url + ".json");
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            if (this.response) {
                var data = JSON.parse(this.response);
                for (var i in data) {
                    data[i].key = i;
                    app.bands.push(data[i]);
                }
                app.output();
            }
        } else {
            console.log("Error on Get");
        };

    };
    request.onerror = function () {
        console.log("communication error");
    }
    request.send()

};
app.edit = function () { };
app.save = function () { };
app.delete = function () { };

app.read();
