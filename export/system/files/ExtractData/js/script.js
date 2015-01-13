var serverAddress = '../geoserver/esipe';

//Add style to popup menu
$("#menu").css('top', '0px').css('right', '0px').dialog({
    width: '520px',
    position: {
        my: "right top",
        at: "right top",
        of: $("#map")
    }
}).dialogExtend({
    "minimizable": true,
    closable: false,
    "dblclick": "minimize"
});
//////////////////////////

//Add style to radio buttons
$("#radio").buttonset();
//////////////////////////

//Add style to text boxes
var topText = $("#top");
var rightText = $("#right");
var leftText = $("#left");
var bottomText = $("#bottom");
topText.css('margin-left', (topText.width() / 2) + 'px');
bottomText.css('margin-left', (bottomText.width() / 2) + 'px');
//////////////////////////

//Add style to raster/vector button
var resolutionDiv = $("#resolutionDiv");
var resolutionBox = $("#resolutionBox");
var buttonVector = $("#radio2");
var buttonRaster = $("#radio1");
buttonVector.click(function() {
    resolutionDiv.fadeOut();
});
buttonRaster.click(function() {
    resolutionDiv.fadeIn();
});
//////////////////////////

//Add style to download button
$("#download").button({
    icons: {
        primary: "ui-icon-circle-arrow-s"
    }
}).click(function(event) {
    event.preventDefault();
});
//////////////////////////


//Create OpenLayers map object
var map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 4
    })
});
var mapLayers = map.getLayers();
//////////////////////////


//Attach bouding box drawing tool to the map
var boundingBox = new ol.interaction.DragBox({
    condition: ol.events.condition.shiftKeyOnly,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: [0, 255, 0, 0.5]
        }),
        stroke: new ol.style.Stroke({
            color: [0, 255, 0, 1]
        })
    })
});
map.addInteraction(boundingBox);
var featureOverlay = new ol.FeatureOverlay({
    map: map,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: [0, 255, 0, 0.5]
        }),
        stroke: new ol.style.Stroke({
            color: [0, 255, 0, 1]
        })
    })
});
var feature;
boundingBox.on('boxstart', function() {
    featureOverlay.removeFeature(feature);
});
//////////////////////////


var layerSelector = $("#layerSelect");
var layers = [];


//Receive layers list from geoserver
$.ajax(serverAddress + '/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GETCAPABILITIES').then(function(response) {

	//Parse WMS capabilities
    var wmsParser = new ol.format.WMSCapabilities();
    var wmsCapabilities = wmsParser.read(response);
    var wmsLayers = wmsCapabilities.Capability.Layer.Layer;
    for (var i = 0; i < wmsLayers.length; ++i) {
        var wmsLayer = wmsLayers[i];
        layers.push(wmsLayer);
        $("<option />", {
            value: wmsLayer.Name,
            text: wmsLayer.Title,
            vector: false
        }).appendTo(layerSelector);
    }
    
    //Parse WFS capabilities for all layers that can be downloaded as vector
    $.ajax(serverAddress + '/ows?SERVICE=WFS&VERSION=1.0.0&&REQUEST=GETCAPABILITIES').then(function(response) {
        var wfsCapabilities = response.documentElement;
        var wfsLayers = wfsCapabilities.getElementsByTagName("FeatureType");
        for (var i = 0; i < wfsLayers.length; ++i) {
            var wfsLayer = wfsLayers[i];
            var layerTitle = wfsLayer.getElementsByTagName("Title")[0];
            layerSelector.find('option:contains(' + layerTitle.textContent + ')').each(function() {
                if ($(this).text() == layerTitle.textContent) {
                    $(this).attr('vector', true);
                }
            });
        }
        
        
        
        //Add first layer to the map
        var firstLayer = layers[0];
        mapLayers.push(new ol.layer.Tile({
            extent: firstLayer.BoundingBox[0].extent,
            source: new ol.source.TileWMS(({
                url: serverAddress + '/wms',
                params: {
                    'LAYERS': 'esipe:' + firstLayer.Name,
                    'TILED': true
                },
                serverType: 'geoserver'
            }))
        }));
        var selectedOption = layerSelector.find(':selected');
        if (selectedOption.attr('vector') == 'true') {
            buttonVector.attr('disabled', false);
        } else {
            buttonVector.attr('disabled', true);
        }
        $("#radio").buttonset("refresh");
        
        resolutionBox.val(map.getView().getResolution());

    });
});
//////////////////////////


//Add handler to layer selector
layerSelector.change(function() {
    var selectedOption = $(this).find(':selected');
    var selectedLayer = layers[selectedOption.index()];
    mapLayers.pop();
    mapLayers.push(new ol.layer.Tile({
        extent: selectedLayer.BoundingBox[0].extent,
        source: new ol.source.TileWMS(({
            url: serverAddress + '/wms',
            params: {
                'LAYERS': 'esipe:' + selectedLayer.Name,
                'TILED': true
            },
            serverType: 'geoserver'
        }))
    }));
    if (selectedOption.attr('vector') == 'true') {
        buttonVector.attr('disabled', false);
    } else {
        buttonVector.attr('disabled', true);
    }
    $("#radio").buttonset("refresh");
});
//////////////////////////


//Add handler to download button
var buttonDownload = $("#download");
buttonDownload.click(function() {
    if (true) {
        var url;
        var extent = [leftText.val(), bottomText.val(), rightText.val(), topText.val()];
        var index = layerSelector.find(':selected').index();
        var selectedLayer = layers[index];
        
        if (topText.val().length > 0 && bottomText.val().length > 0 && leftText.val().length > 0 && rightText.val().length > 0) {
                    if (parseFloat(topText.val()) < parseFloat(bottomText.val())) {
                        alert("Attention valeur incorrecte pour la bounding box (cause : top < down)");
                        return;
                    } else if (parseFloat(leftText.val()) > parseFloat(rightText.val())) {
                        alert("Attention valeur incorrecte pour la bounding box (cause : right < left)");
                        return;
                    } 
                } else {
                    alert("Attention un ou plusieurs champ(s) est(sont) vide(s)");
                    return;
                }
        
        if (buttonRaster.is(':checked')) {
            var res = resolutionBox.val();
            if (res.length > 0) {
                
                        var width = Math.ceil(ol.extent.getWidth(extent) / res);
                        var height = Math.ceil(ol.extent.getHeight(extent) / res);
                        url = serverAddress + '/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&FORMAT=image%2Fgeotiff&TRANSPARENT=true&LAYERS=esipe%3A' + selectedLayer.Name +
                            '&TILED=true&WIDTH=' + width + '&HEIGHT=' + height + '&CRS=EPSG%3A4326&BBOX=' + extent;
                 
            } else {
                alert("No resolution");
                return;
            }
        } else {
            url = serverAddress + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=esipe%3A' + selectedLayer.Name + '&maxfeatures=100&outputformat=SHAPE-ZIP&bbox=' + extent;
        }
        window.open(url, 'Download');
    } else {
        alert("No BBox selected");
    }
});
//////////////////////////

//Add handler to change on text boxes
var changer = function() {
    if (parseFloat(topText.val()) < parseFloat(bottomText.val())) {
        alert("Attention valeur incorrecte pour la bounding box (cause : top < down)");
        return;
    } else if (parseFloat(leftText.val()) > parseFloat(rightText.val())) {
        alert("Attention valeur incorrecte pour la bounding box (cause : right < left)");
        return;
    } else {
        if (feature != null) {
            featureOverlay.removeFeature(feature);
        }
        var geom = new ol.geom.Polygon([
            [
                [parseInt(leftText.val()), parseInt(topText.val())],
                [parseInt(rightText.val()), parseInt(topText.val())],
                [parseInt(rightText.val()), parseInt(bottomText.val())],
                [parseInt(leftText.val()), parseInt(bottomText.val())],
                [parseInt(leftText.val()), parseInt(topText.val())]
            ]
        ]);
        feature = new ol.Feature({
            geometry: geom
        });
        featureOverlay.addFeature(feature);
    }
};
topText.change(changer);
bottomText.change(changer);
leftText.change(changer);
rightText.change(changer);
//////////////////////////


//Add handler to end of bounding box drawing
boundingBox.on('boxend', function(e) {
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