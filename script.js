if(COVID==undefined){var COVID={};}


COVID.general = function() {

    this.map;

    this.sort = 'total';

    this.globalData = {};

    this.countryData = {};

    this.mapOptions = {
        zoom: 3,
        minZoom: 1,
        center: new google.maps.LatLng(50.7244893,3.2668189),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        backgroundColor: 'none'
    };

    this.mapStyles = [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#222529"
                },
                {
                    "visibility": "on"
                }
            ]
        }
    ];

    this.countries = [];

    this.init = function() {

        this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);

        this.map.setOptions({styles: this.mapStyles});

        //this.country('US', "United States of America");

        this.loadGlobal();

        this.loadCountries();

        $("#stats-nav li").on("click", function () {
            $("#navigation a").removeClass("active");

            $("#countries-stats-infected").hide();
            $("#countries-stats-deaths").hide();
            $("#countries-stats-active").hide();
            $("#countries-stats-recovered").hide();
            $("#"+$(this).data("id")).show();

            $("#country-stats-infected").hide();
            $("#country-stats-active").hide();
            $("#country-stats-deaths").hide();
            $("#country-stats-recovered").hide();
            $("#"+$(this).data("id-two")).show();

            $("#stats-nav li").removeClass("active");

            $("#navigation a."+$(this).attr("class")+"").addClass("active");

            $(this).addClass("active");
        });

        $("#navigation a").on("click", function () {
            if ($(this).attr("class") == "about") {
                $("#modal").show();
            } else {
                $("#navigation a").removeClass("active");
                $("#stats-nav li").removeClass("active");
                $("#stats-nav li."+$(this).attr("class")+"").addClass("active").trigger("click");
                $(this).addClass("active");
            }
        });

        $("#modal").on("click", function (e) {
            if (e.target.id == "modal") {
                $("#modal").hide();
            }
        });

        $(".sort-new").on("click", function () {
            this.sort = 'new';
            $(".sort-total").show();
            $(".sort-new").hide();
            this.loadGlobal();
        }.bind(this));

        $(".sort-total").on("click", function () {
            this.sort = 'total';
            $(".sort-total").hide();
            $(".sort-new").show();
            this.loadGlobal();
        }.bind(this));

        $(".global-vs-country li").on("click", function (e) {
            $(".global-vs-country li").removeClass("active");

            if ($(e.delegateTarget).hasClass("global")) {
                $(".stats-countries").show();
                $(".stats-country").hide();

                $("#place").text("Global Cases")
                $("#total").text(this.globalData.total)
                $("#active").text(this.globalData.active)
                $("#deaths").text(this.globalData.deaths)
                $("#recovered").text(this.globalData.recovered)
                $("#date").text(this.globalData.date)
            }
            if ($(e.delegateTarget).hasClass("country")) {
                $(".stats-countries").hide();
                $(".stats-country").show();

                $("#place").text(this.countryData.title)
                $("#total").text(this.countryData.total)
                $("#active").text(this.countryData.active)
                $("#deaths").text(this.countryData.deaths)
                $("#recovered").text(this.countryData.recovered)
                $("#date").text(this.countryData.date)
            }

            $(e.delegateTarget).addClass("active");
        }.bind(this));

        $(".sidebar .close").on("click", function () {
            $(".sidebar").removeClass("active");
        });

        $(".show-stats").on("click", function () {
            $(".sidebar").addClass("active");
        });

        $(".show-about").on("click", function () {
            $("#modal").show();
        });
    }

    this.loadGlobal = function () {

        this.showLoading();

        $(".global-vs-country li").removeClass("active");
        $(".global-vs-country li.global").addClass("active");

        $.ajax({
            url : 'https://api.covid19api.com/summary',
            cache : true,
            dataType : 'json',
            async : true,

            success : function(data) {

                this.globalData = {
                    "total": data.Global.TotalConfirmed.toLocaleString(window.document.documentElement.lang),
                    "active": (data.Global.TotalConfirmed-data.Global.TotalRecovered).toLocaleString(window.document.documentElement.lang),
                    "deaths": data.Global.TotalDeaths.toLocaleString(window.document.documentElement.lang),
                    "recovered": data.Global.TotalRecovered.toLocaleString(window.document.documentElement.lang),
                    "date": new Date(data.Date).toLocaleDateString()
                };

                $("#total").text(this.globalData.total)
                $("#date").text(this.globalData.date)
                $("#active").text(this.globalData.active)
                $("#deaths").text(this.globalData.deaths)
                $("#recovered").text(this.globalData.recovered)

                $("#countries-stats-infected").empty();
                $("#countries-stats-deaths").empty();
                $("#countries-stats-active").empty();
                $("#countries-stats-recovered").empty();

                $.each(data.Countries.sort(function(a, b) {
                    if (this.sort == 'total') {
                        return parseFloat((parseFloat(b.TotalConfirmed)-parseFloat(b.TotalRecovered))-(parseFloat(a.TotalConfirmed)-parseFloat(a.TotalRecovered)));
                    } else {
                        return parseFloat((parseFloat(b.NewConfirmed)-parseFloat(b.NewRecovered))-(parseFloat(a.NewConfirmed)-parseFloat(a.NewRecovered)));
                    }
                }.bind(this)), function(id,country) {
                    $("#countries-stats-active").append('<li data-code="'+country.CountryCode.toLowerCase()+'" data-title="'+country.Country.toLowerCase()+'">\n' +
                        '<img src="images/'+country.CountryCode.toLowerCase()+'.png" alt="'+country.CountryCode+'" class="flag">\n' +
                        '<p><span class="title">'+country.Country+'</span> <span class="new">+'+(country.NewConfirmed-country.NewRecovered).toLocaleString(window.document.documentElement.lang)+'</span> <span class="total">'+(country.TotalConfirmed-country.TotalRecovered).toLocaleString(window.document.documentElement.lang)+'</span></p>\n' +
                        '</li>');
                });

                $.each(data.Countries.sort(function(a, b) {
                    if (this.sort == 'total') {
                        return parseFloat(b.TotalConfirmed)-parseFloat(a.TotalConfirmed);
                    } else {
                        return parseFloat(b.NewConfirmed)-parseFloat(a.NewConfirmed);
                    }
                }.bind(this)), function(id,country) {
                    $("#countries-stats-infected").append('<li data-code="'+country.CountryCode.toLowerCase()+'" data-title="'+country.Country.toLowerCase()+'">\n' +
                        '<img src="images/'+country.CountryCode.toLowerCase()+'.png" alt="'+country.CountryCode+'" class="flag">\n' +
                        '<p><span class="title">'+country.Country+'</span> <span class="new">+'+country.NewConfirmed.toLocaleString(window.document.documentElement.lang)+'</span> <span class="total">'+country.TotalConfirmed.toLocaleString(window.document.documentElement.lang)+'</span></p>\n' +
                        '</li>');
                });

                $.each(data.Countries.sort(function(a, b) {
                    if (this.sort == 'total') {
                        return parseFloat(b.TotalDeaths)-parseFloat(a.TotalDeaths);
                    } else {
                        return parseFloat(b.NewDeaths)-parseFloat(a.NewDeaths);
                    }
                }.bind(this)), function(id,country) {
                    $("#countries-stats-deaths").append('<li data-code="'+country.CountryCode.toLowerCase()+'" data-title="'+country.Country.toLowerCase()+'">\n' +
                        '<img src="images/'+country.CountryCode.toLowerCase()+'.png" alt="'+country.CountryCode+'" class="flag">\n' +
                        '<p><span class="title">'+country.Country+'</span> <span class="new">+'+country.NewDeaths.toLocaleString(window.document.documentElement.lang)+'</span> <span class="total">'+country.TotalDeaths.toLocaleString(window.document.documentElement.lang)+'</span></p>\n' +
                        '</li>');
                });

                $.each(data.Countries.sort(function(a, b) {
                    if (this.sort == 'total') {
                        return parseFloat(b.TotalRecovered)-parseFloat(a.TotalRecovered);
                    } else {
                        return parseFloat(b.NewRecovered)-parseFloat(a.NewRecovered);
                    }
                }.bind(this)), function(id,country) {
                    $("#countries-stats-recovered").append('<li data-code="'+country.CountryCode.toLowerCase()+'" data-title="'+country.Country.toLowerCase()+'">\n' +
                        '<img src="images/'+country.CountryCode.toLowerCase()+'.png" alt="'+country.CountryCode+'" class="flag">\n' +
                        '<p><span class="title">'+country.Country+'</span> <span class="new">+'+country.NewRecovered.toLocaleString(window.document.documentElement.lang)+'</span> <span class="total">'+country.TotalRecovered.toLocaleString(window.document.documentElement.lang)+'</span></p>\n' +
                        '</li>');
                });

                $("#countries-stats-recovered li, #countries-stats-deaths li, #countries-stats-infected li, #countries-stats-active li").on("click", function (event) {
                    this.country($(event.delegateTarget).data("code"), $(event.delegateTarget).data("title"));
                }.bind(this));

                this.hideLoading();

            }.bind(this)
        });
    }

    this.loadCountries = function() {

        this.showLoading();

        $.ajax({
            url : 'data.json',
            cache : true,
            dataType : 'json',
            async : true,

            success : function(data) {

                if (data) {

                    $.each(data, function(id,country) {

                        var countryCoords;
                        var ca;
                        var co;

                        if ('multi' in country) {

                            var ccArray = [];

                            for (var t in country['xml']['Polygon']) {

                                countryCoords = [];

                                co = country['xml']['Polygon'][t]['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                                for (var i in co) {

                                    ca = co[i].split(',');

                                    countryCoords.push(new google.maps.LatLng(ca[1], ca[0]));
                                }

                                ccArray.push(countryCoords);
                            }

                            this.createCountry(ccArray,country);

                        } else {

                            countryCoords = [];

                            co = country['xml']['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                            for (var j in co) {

                                ca = co[j].split(',');

                                countryCoords.push(new google.maps.LatLng(ca[1], ca[0]));
                            }

                            this.createCountry(countryCoords,country);
                        }
                    }.bind(this));

                    this.showCountries();
                }

                this.hideLoading();

            }.bind(this)
        });
    }

    this.showCountries = function() {

        for (var i=0; i<this.countries.length; i++) {
            this.countries[i].setMap(this.map);

            google.maps.event.addListener(this.countries[i],"mouseover",function(){
                this.setOptions({fillColor: "#f5c879", 'fillOpacity': 0.5});
            });

            google.maps.event.addListener(this.countries[i],"mouseout",function(){
                this.setOptions({fillColor: "#f5c879", 'fillOpacity': 0});
            });

            google.maps.event.addListener(this.countries[i], 'click', function(event) {

                setTimeout(function () {
                    this.setOptions({strokeWeight: 2.0, fillColor: '#f5c879', 'fillOpacity': 0.8});
                }.bind(this), 100);

                cvd.country(this.code, this.title);

            });
        }
    }

    this.country = function (code, title) {

        $(".global-vs-country li").removeClass("active");
        $(".global-vs-country li.country").addClass("active");

        this.showLoading();

        $("#country-stats-infected").show().empty().append('<canvas id="chart-infected" style="height: 300px;"></canvas>');
        $("#country-stats-active").show().empty().append('<canvas id="chart-active" style="height: 300px;"></canvas>');
        $("#country-stats-deaths").show().empty().append('<canvas id="chart-deaths" style="height: 300px;"></canvas>');
        $("#country-stats-recovered").show().empty().append('<canvas id="chart-recovered" style="height: 300px;"></canvas>');

        $(".global-vs-country .country a").html('<img src="images/'+code.toLowerCase()+'.png"> '+title);

        $(".stats-countries").hide();
        $(".stats-country").show();

        $.ajax({
            url : "https://api.covid19api.com/country/"+code,
            cache : true,
            dataType : 'json',
            async : true,

            success : function(data) {

                $(".sidebar").addClass("active");

                if (data) {

                    let dates = [];
                    let cases = [];
                    let newcases = [];
                    let deaths = [];
                    let newdeaths = [];
                    let recovered = [];
                    let newrecovered = [];

                    let actives = [];
                    let newactives = [];

                    var newcase = 0;
                    var newdeath = 0;
                    var newrecover = 0;
                    var newactive = 0;
                    var lat = 0;
                    var lng = 0;
                    var lastDate;

                    $.each(data, function(id,date) {

                        dates.push(date.Date.substr(0, 10));
                        cases.push(date.Confirmed);
                        deaths.push(date.Deaths);
                        recovered.push(date.Recovered);
                        actives.push(date.Confirmed-date.Recovered);

                        newcases.push(date.Confirmed-newcase);
                        newdeaths.push(date.Deaths-newdeath);
                        newrecovered.push(date.Recovered-newrecover);
                        newactives.push((date.Confirmed-date.Recovered)-newactive);

                        newcase = date.Confirmed;
                        newdeath = date.Deaths;
                        newrecover = date.Recovered;
                        newactive = date.Confirmed-date.Recovered;

                        lastDate = date.Date;

                        lat = date.Lat;
                        lng = date.Lon;
                    });


                    this.countryData = {
                        "title": title.charAt(0).toUpperCase() + title.slice(1)+" cases",
                        "total": newcase.toLocaleString(window.document.documentElement.lang),
                        "active": newactive.toLocaleString(window.document.documentElement.lang),
                        "deaths": newdeath.toLocaleString(window.document.documentElement.lang),
                        "recovered": newrecover.toLocaleString(window.document.documentElement.lang),
                        "date": new Date(lastDate).toLocaleDateString()
                    };

                    $("#date").text(this.countryData.date)
                    $("#place").text(this.countryData.title)
                    $("#total").text(this.countryData.total)
                    $("#active").text(this.countryData.active)
                    $("#deaths").text(this.countryData.deaths)
                    $("#recovered").text(this.countryData.recovered)

                    this.map.setCenter(new google.maps.LatLng(lat, lng));
                    this.map.setZoom(5);

                    var ctx = document.getElementById('chart-infected').getContext('2d');
                    ctx.restore();
                    ctx.height = 200;

                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [
                                {
                                    label: 'Infected',
                                    backgroundColor: 'rgb(186, 49, 49)',
                                    borderColor: 'rgb(186, 49, 49)',
                                    fill: false,
                                    data: cases
                                },
                                {
                                    label: 'Infected New',
                                    backgroundColor: 'rgb(246, 200, 121)',
                                    borderColor: 'rgb(246, 200, 121)',
                                    fill: false,
                                    data: newcases
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    }
                                }]
                            }
                        }
                    });

                    var ctx = document.getElementById('chart-active').getContext('2d');
                    ctx.restore();
                    ctx.height = 200;

                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [
                                {
                                    label: 'Active',
                                    backgroundColor: 'rgb(186, 49, 49)',
                                    borderColor: 'rgb(186, 49, 49)',
                                    fill: false,
                                    data: actives
                                },
                                {
                                    label: 'Active New',
                                    backgroundColor: 'rgb(246, 200, 121)',
                                    borderColor: 'rgb(246, 200, 121)',
                                    fill: false,
                                    data: newactives
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    }
                                }]
                            }
                        }
                    });

                    var ctx = document.getElementById('chart-deaths').getContext('2d');
                    ctx.restore();
                    ctx.height = 200;

                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [
                                {
                                    label: 'Deaths',
                                    backgroundColor: 'rgb(186, 49, 49)',
                                    borderColor: 'rgb(186, 49, 49)',
                                    fill: false,
                                    data: deaths
                                },
                                {
                                    label: 'Deaths New',
                                    backgroundColor: 'rgb(246, 200, 121)',
                                    borderColor: 'rgb(246, 200, 121)',
                                    fill: false,
                                    data: newdeaths
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    }
                                }]
                            }
                        }
                    });

                    var ctx = document.getElementById('chart-recovered').getContext('2d');
                    ctx.restore();
                    ctx.height = 200;

                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [
                                {
                                    label: 'Recovered',
                                    backgroundColor: 'rgb(186, 49, 49)',
                                    borderColor: 'rgb(186, 49, 49)',
                                    fill: false,
                                    data: recovered
                                },
                                {
                                    label: 'Recovered New',
                                    backgroundColor: 'rgb(246, 200, 121)',
                                    borderColor: 'rgb(246, 200, 121)',
                                    fill: false,
                                    data: newrecovered
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    }
                                }]
                            }
                        }
                    });

                    $("#country-stats-infected").show();
                    $("#country-stats-active").hide();
                    $("#country-stats-deaths").hide();
                    $("#country-stats-recovered").hide()


                }

                this.hideLoading();
            }.bind(this)
        });
    }

    this.createCountry = function(coords, country) {

        var currentCountry = new google.maps.Polygon({
            paths: coords,
            //strokeColor: 'white',
            title: country.country,
            code: country.iso,
            strokeOpacity: 0,
            // strokeWeight: 1,
            // fillColor: country['color'],
            fillOpacity: 0
        });

        this.countries.push(currentCountry);
    }

    this.showLoading = function () {
        $(".loading").show();
    }

    this.hideLoading = function () {
        $(".loading").fadeOut();
    }
}

cvd = new COVID.general();
cvd.init();




