

$("#menu").css('top', '0px').css('right', '0px')
        .dialog({width: '520px'
            , position: {my: "right top", at: "right top", of: $("#map")}}).dialogExtend({
    "minimizable": true,
    closable: false,
    "dblclick": "minimize"});


var topText = $("#top");
var rightText = $("#right");
var leftText = $("#left");
var bottomText = $("#bottom");

topText.css('margin-left', (topText.width() / 2) + 'px');
bottomText.css('margin-left', (bottomText.width() / 2) + 'px');

$("#radio").buttonset();

$("#download")
        .button({
            icons: {
                primary: "ui-icon-circle-arrow-s"
            }
        })
        .click(function (event) {
            event.preventDefault();
        });

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            extent: [-180, -90, 180, 90],
            source: new ol.source.TileWMS(({
                url: '../geoserver/esipe/wms',
                params: {'LAYERS': 'esipe:NE1_HR_LC_SR_W_DR', 'TILED': true},
                serverType: 'geoserver'
            }))
        })

    ],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 4
    })
});
var boundingBox = new ol.interaction.DragBox({
    condition: ol.events.condition.shiftKeyOnly,
    style: new ol.style.Style({
        fill: new ol.style.Fill({color: [0, 255, 0, 0.5]}),
        stroke: new ol.style.Stroke({
            color: [0, 255, 0, 1]
        })
    })
});
map.addInteraction(boundingBox);


var featureOverlay = new ol.FeatureOverlay({
    map: map,
    style: new ol.style.Style({
        fill: new ol.style.Fill({color: [0, 255, 0, 0.5]}),
        stroke: new ol.style.Stroke({color: [0, 255, 0, 1]})
    })
});
var feature;


boundingBox.on('boxstart', function () {
    featureOverlay.removeFeature(feature);
});



var resolutionDiv = $("#resolutionDiv");
var resolutionBox = $("#resolutionBox");

var buttonVector = $("#radio2");
var buttonRaster = $("#radio1");
buttonVector.click(function () {
    resolutionDiv.fadeOut();
    var layersss = map.getLayers();
    layersss.pop();
    layersss.push(new ol.layer.Tile({
            extent: [-180, -90, 180, 90],
            source: new ol.source.TileWMS(({
                url: '../geoserver/esipe/wms',
                params: {'LAYERS': 'esipe:ne_10m_admin_0_countries', 'TILED': true},
                serverType: 'geoserver'
            }))
        }));
});
buttonRaster.click(function () {
    resolutionDiv.fadeIn();
    var layersss = map.getLayers();
    layersss.pop();
    layersss.push(new ol.layer.Tile({
            extent: [-180, -90, 180, 90],
            source: new ol.source.TileWMS(({
                url: '../geoserver/esipe/wms',
                params: {'LAYERS': 'esipe:NE1_HR_LC_SR_W_DR', 'TILED': true},
                serverType: 'geoserver'
            }))
        }));
});

var buttonDownload = $("#download");
buttonDownload.click(function () {
    if (true) {
        var url;
        var extent = [leftText.val(), bottomText.val(), rightText.val(), topText.val()];

        if (buttonRaster.is(':checked')) {
            var res = resolutionBox.val();

            if (res.length > 0) {


                if (topText.val().length > 0 && bottomText.val().length > 0
                        && leftText.val().length > 0 && rightText.val().length > 0) {

                    if (parseFloat(topText.val()) < parseFloat(bottomText.val())) {
                        alert("Attention valeur incorrecte pour la bounding box (cause : top < down)");
                        return;
                    }
                    else if (parseFloat(leftText.val()) > parseFloat(rightText.val())) {
                        alert("Attention valeur incorrecte pour la bounding box (cause : right < left)");
                        return;
                    }
                    else {
                        var width = Math.ceil(ol.extent.getWidth(extent) / res);
                        var height = Math.ceil(ol.extent.getHeight(extent) / res);
                		url = '../geoserver/esipe/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&FORMAT=image%2Fgeotiff&TRANSPARENT=true&LAYERS=esipe%3ANE1_HR_LC_SR_W_DR&TILED=true&WIDTH=' + width + '&HEIGHT=' + height + '&CRS=EPSG%3A4326&BBOX=' + extent;
                    }
                }
                else {
                    alert("Attention un ou plusieurs champ(s) est(sont) vide(s)");
                    return;
                }
            } else {
                alert("No resolution");
                return;
            }
        }
        else {
            url = '../geoserver/esipe/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=esipe%3Ane_10m_admin_0_countries&maxfeatures=100&outputformat=SHAPE-ZIP&bbox=' + extent;

        }

        window.open(url, 'Download');
    } else {
        alert("No BBox selected");
    }
});

var changer = function () {
    
    if (parseFloat(topText.val()) < parseFloat(bottomText.val())) {
        alert("Attention valeur incorrecte pour la bounding box (cause : top < down)");
        return;
    }
    else if (parseFloat(leftText.val()) > parseFloat(rightText.val())) {
        alert("Attention valeur incorrecte pour la bounding box (cause : right < left)");
        return;
    }
    else {
        if (feature != null) {
            featureOverlay.removeFeature(feature);
        }
        var geom = new ol.geom.Polygon([[[parseInt(leftText.val()), parseInt(topText.val())]
                , [parseInt(rightText.val()), parseInt(topText.val())]
                , [parseInt(rightText.val()), parseInt(bottomText.val())]
                , [parseInt(leftText.val()), parseInt(bottomText.val())]
                , [parseInt(leftText.val()), parseInt(topText.val())]]
                ]);
        feature = new ol.Feature({geometry: geom});
        featureOverlay.addFeature(feature);
    }
};

topText.change(changer);

bottomText.change(changer);

leftText.change(changer);

rightText.change(changer);

boundingBox.on('boxend', function (e) {

    var geom = boundingBox.getGeometry();

    feature = new ol.Feature({
        geometry: geom
    });
    featureOverlay.addFeature(feature);

    var extent = geom.getExtent();

    topText.val(extent[3]);
    bottomText.val(extent[1]);
    leftText.val(extent[0]);
    rightText.val(extent[2]);

    var res = map.getView().getResolution();

    resolutionBox.val(res);

    var width = ol.extent.getWidth(extent) / res;
    var height = ol.extent.getHeight(extent) / res;

    return;

});



var parser = new ol.format.WMSCapabilities();

$.ajax('../geoserver/esipe/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GETCAPABILITIES').then(function(response) {

  var result = parser.read(response);
  var layersss = result.Capability.Layer.Layer;
  for(var i = 0; i<layersss.length; ++i){
  		console.log(layersss[i]);
  }
  //console.log(window.JSON.stringify(result, null, 2));
});