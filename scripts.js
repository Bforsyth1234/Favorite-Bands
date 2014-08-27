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
        holder += "<td><button class='btn btn-warning' onclick='app.edit(" + i + ")'>Edit</button>&nbsp;";
        holder += "<button class='btn btn-danger' onclick='app.delete(" + i + ")'>Delete</button></ td>";
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
app.edit = function (index) {
    document.getElementById("edit-name").value = app.bands[index].name;
    document.getElementById("edit-song").value = app.bands[index].song;
    document.getElementById("edit-year").value = app.bands[index].year;
    document.getElementById("index").value = index;
    $('#edit-modal').modal('show');
};
app.save = function () {
    var name = document.getElementById("edit-name").value;
    var song = document.getElementById("edit-song").value;
    var year = document.getElementById("edit-year").value;
    var index = document.getElementById("index").value;
    var band = new app.Band(name, song, year);
    band.key = app.bands[index].key;
    var request = new XMLHttpRequest();
    request.open("PUT", app.url + app.bands[index].key + ".json");
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            app.bands[index] = band;
            app.output();

        } else {
            console.log("erroe on put");
        }
    }
    request.onerror = function () {
        console.log("comm error");
    };
    request.send(JSON.stringify(band));
    $('#edit-modal').modal('hide');

};
app.delete = function (index) {
    
    var request = new XMLHttpRequest();
    request.open("DELETE", app.url + app.bands[index].key + ".json");
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            app.bands.splice(index, 1);
            app.output();
        } else {
            console.log("Error on Delete");
        };
    }
    request.onerror = function () {
        console.log("comm erroer");
        }
    request.send();
};

app.read();
