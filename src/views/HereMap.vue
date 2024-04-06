<template>
  <div id="map">
    <input v-model="this.clickedlatlanstr" type="text">
    <!--In the following div the HERE Map will render-->
    <div id="mapContainer" ref="hereMap" style="height:600px;width:100%" />
  </div>
</template>

<script>
// import polygon from 'vue2-google-maps/dist/components/polygon';
export default {
  name: 'HereMap',

  data() {
    return {
      platform: null,
      apikey: 'hpwTfOkmR7qhTEn9Iv_PJYy7M6J6BJD4dUirOo-QtV0',
      lat: '-25.731340',
      lng: '28.2293',
      map: null,
      logContainer: null,
      center: null,
      clickedlatlanstr: '',
      markers: [],
      farmbounderies: null

      // You can get the API KEY from developer.here.com
    }
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    })
    this.platform = platform
    this.initializeHereMap()

    // Step 4: create custom logging facilities
    this.logContainer = document.createElement('ul')
    this.logContainer.className = 'log'
    this.logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>'
    this.map.getElement().appendChild(this.logContainer)
    this.setUpClickListener(this.map)
    this.createResizablePolygon(this.map)
    // this.addMarkersAndSetViewBounds(this.map);
    this.addMarkersToMap(this.map)
    this.connectmarkers(this.map)
    // this.removemarkers(this.map);

    // this.createDraggableShapes(this.map)
  },
  methods: {
    addCircleToMap(map) {
      map.addObject(new H.map.Circle(
        // The central point of the circle
        { lat: 28.6071, lng: 77.2127 },
        // The radius of the circle in meters
        1000,
        {
          style: {
            strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
            lineWidth: 2,
            fillColor: 'rgba(0, 128, 0, 0.7)' // Color of the circle
          }
        }
      ))
    },

    createResizablePolygon(map) {
      // -25.731340, lng:28.2293
      var svgCircle = '<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="10" cy="10" r="7" fill="transparent" stroke="red" stroke-width="4"/>' +
          '</svg>'
      var polygon = new H.map.Polygon(
        // new H.geo.Polygon(new H.geo.LineString([-25.7, 28.2, 0, -24.7, 29.2, 0, -24.7, 30.2, 0, -25.7, 31.2, 0, -26.7, 30.2, 0, -26.7, 28.2, 0 ])),
        new H.geo.Polygon(new H.geo.LineString([-25.734747, 28.160192, 0, -25.735070, 28.159608, 0, -25.735979, 28.159718, 0, -25.735944, 28.160767, 0, -25.735460, 28.160824, 0, -25.734944, 28.160698, 0])),
        {
          style: { fillColor: 'rgba(150, 100, 0, .8)', lineWidth: 0 }
        }
      )
      var verticeGroup = new H.map.Group({
        visibility: false
      })
      var mainGroup = new H.map.Group({
        volatility: true, // mark the group as volatile for smooth dragging of all it's objects
        objects: [polygon, verticeGroup]
      })
      var polygonTimeout

      // ensure that the polygon can receive drag events
      polygon.draggable = true

      // create markers for each polygon's vertice which will be used for dragging
      polygon.getGeometry().getExterior().eachLatLngAlt(function(lat, lng, alt, index) {
        var vertice = new H.map.Marker(
          { lat, lng },
          {
            icon: new H.map.Icon(svgCircle, { anchor: { x: 10, y: 10 }})
          }
        )
        vertice.draggable = true
        vertice.setData({ 'verticeIndex': index })
        verticeGroup.addObject(vertice)
      })

      // add group with polygon and it's vertices (markers) on the map
      map.addObject(mainGroup)

      // event listener for main group to show markers if moved in with mouse (or touched on touch devices)
      mainGroup.addEventListener('pointerenter', function(evt) {
        if (polygonTimeout) {
          clearTimeout(polygonTimeout)
          polygonTimeout = null
        }

        // show vertice markers
        verticeGroup.setVisibility(true)
      }, true)

      // event listener for main group to hide vertice markers if moved out with mouse (or released finger on touch devices)
      // the vertice markers are hidden on touch devices after specific timeout
      mainGroup.addEventListener('pointerleave', function(evt) {
        var timeout = (evt.currentPointer.type == 'touch') ? 1000 : 0

        // hide vertice markers
        polygonTimeout = setTimeout(function() {
          verticeGroup.setVisibility(false)
        }, timeout)
      }, true)

      // event listener for vertice markers group to change the cursor to pointer
      verticeGroup.addEventListener('pointerenter', function(evt) {
        document.body.style.cursor = 'pointer'
      }, true)

      // event listener for vertice markers group to change the cursor to default
      verticeGroup.addEventListener('pointerleave', function(evt) {
        document.body.style.cursor = 'default'
      }, true)

      // event listener for vertice markers group to resize the geo polygon object if dragging over markers
      verticeGroup.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer
        var geoLineString = polygon.getGeometry().getExterior()
        var geoPoint = map.screenToGeo(pointer.viewportX, pointer.viewportY)

        // set new position for vertice marker
        evt.target.setGeometry(geoPoint)

        // set new position for polygon's vertice
        geoLineString.removePoint(evt.target.getData()['verticeIndex'])
        geoLineString.insertPoint(evt.target.getData()['verticeIndex'], geoPoint)
        polygon.setGeometry(new H.geo.Polygon(geoLineString))

        // stop propagating the drag event, so the map doesn't move
        evt.stopPropagation()
      }, true)

      // add event listeners for polygon object
      polygon.addEventListener('dragstart', function(evt) {
        var pointer = evt.currentPointer
        var object = evt.target

        // store the starting geo position
        object.setData({
          startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
        })
        evt.stopPropagation()
      })

      polygon.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer
        var object = evt.target
        var startCoord = object.getData()['startCoord']
        var newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY)
        var outOfMapView = false

        if (!newCoord.equals(startCoord)) {
          var currentLineString = object.getGeometry().getExterior()
          var newLineString = new H.geo.LineString()

          // create new LineString with updated coordinates
          currentLineString.eachLatLngAlt(function(lat, lng, alt) {
            var diffLat = (lat - startCoord.lat)
            var diffLng = (lng - startCoord.lng)
            var newLat = newCoord.lat + diffLat
            var newLng = newCoord.lng + diffLng

            // prevent dragging to latitude over 90 or -90 degrees to prevent loosing altitude values
            if (newLat >= 90 || newLat <= -90) {
              outOfMapView = true
              return
            }

            newLineString.pushLatLngAlt(newLat, newLng, 0)
          })

          if (!outOfMapView) {
            object.setGeometry(new H.geo.Polygon(newLineString))
            object.setData({
              startCoord: newCoord
            })
            // set new position for polygon's vertice
            verticeGroup.removeAll()
            polygon.getGeometry().getExterior().eachLatLngAlt(function(lat, lng, alt, index) {
              var vertice = new H.map.Marker(
                { lat, lng },
                {
                  icon: new H.map.Icon(svgCircle, { anchor: { x: 10, y: 10 }})
                }
              )
              vertice.draggable = true
              vertice.setData({ 'verticeIndex': index })
              verticeGroup.addObject(vertice)
            })
          }
        }
        evt.stopPropagation()
      })

      this.farmbounderies = polygon
    },

    /* createDraggableShapes(map) {
      var brazilWKTgeometry = 'POLYGON ((-57.625133 -30.216295, -56.2909 -28.852761, -55.162286 -27.881915, -54.490725 -27.474757, -53.648735 -26.923473, -53.628349 -26.124865, -54.13005 -25.547639, -54.625291 -25.739255, -54.428946 -25.162185, -54.293476 -24.5708, -54.29296 -24.021014, -54.652834 -23.839578, -55.027902 -24.001274, -55.400747 -23.956935, -55.517639 -23.571998, -55.610683 -22.655619, -55.797958 -22.35693, -56.473317 -22.0863, -56.88151 -22.282154, -57.937156 -22.090176, -57.870674 -20.732688, -58.166392 -20.176701, -57.853802 -19.969995, -57.949997 -19.400004, -57.676009 -18.96184, -57.498371 -18.174188, -57.734558 -17.552468, -58.280804 -17.27171, -58.388058 -16.877109, -58.24122 -16.299573, -60.15839 -16.258284, -60.542966 -15.09391, -60.251149 -15.077219, -60.264326 -14.645979, -60.459198 -14.354007, -60.503304 -13.775955, -61.084121 -13.479384, -61.713204 -13.489202, -62.127081 -13.198781, -62.80306 -13.000653, -63.196499 -12.627033, -64.316353 -12.461978, -65.402281 -11.56627, -65.321899 -10.895872, -65.444837 -10.511451, -65.338435 -9.761988, -66.646908 -9.931331, -67.173801 -10.306812, -68.048192 -10.712059, -68.271254 -11.014521, -68.786158 -11.03638, -69.529678 -10.951734, -70.093752 -11.123972, -70.548686 -11.009147, -70.481894 -9.490118, -71.302412 -10.079436, -72.184891 -10.053598, -72.563033 -9.520194, -73.226713 -9.462213, -73.015383 -9.032833, -73.571059 -8.424447, -73.987235 -7.52383, -73.723401 -7.340999, -73.724487 -6.918595, -73.120027 -6.629931, -73.219711 -6.089189, -72.964507 -5.741251, -72.891928 -5.274561, -71.748406 -4.593983, -70.928843 -4.401591, -70.794769 -4.251265, -69.893635 -4.298187, -69.444102 -1.556287, -69.420486 -1.122619, -69.577065 -0.549992, -70.020656 -0.185156, -70.015566 0.541414, -69.452396 0.706159, -69.252434 0.602651, -69.218638 0.985677, -69.804597 1.089081, -69.816973 1.714805, -67.868565 1.692455, -67.53781 2.037163, -67.259998 1.719999, -67.065048 1.130112, -66.876326 1.253361, -66.325765 0.724452, -65.548267 0.789254, -65.354713 1.095282, -64.611012 1.328731, -64.199306 1.492855, -64.083085 1.916369, -63.368788 2.2009, -63.422867 2.411068, -64.269999 2.497006, -64.408828 3.126786, -64.368494 3.79721, -64.816064 4.056445, -64.628659 4.148481, -63.888343 4.02053, -63.093198 3.770571, -62.804533 4.006965, -62.08543 4.162124, -60.966893 4.536468, -60.601179 4.918098, -60.733574 5.200277, -60.213683 5.244486, -59.980959 5.014061, -60.111002 4.574967, -59.767406 4.423503, -59.53804 3.958803, -59.815413 3.606499, -59.974525 2.755233, -59.718546 2.24963, -59.646044 1.786894, -59.030862 1.317698, -58.540013 1.268088, -58.429477 1.463942, -58.11345 1.507195, -57.660971 1.682585, -57.335823 1.948538, -56.782704 1.863711, -56.539386 1.899523, -55.995698 1.817667, -55.9056 2.021996, -56.073342 2.220795, -55.973322 2.510364, -55.569755 2.421506, -55.097587 2.523748, -54.524754 2.311849, -54.088063 2.105557, -53.778521 2.376703, -53.554839 2.334897, -53.418465 2.053389, -52.939657 2.124858, -52.556425 2.504705, -52.249338 3.241094, -51.657797 4.156232, -51.317146 4.203491, -51.069771 3.650398, -50.508875 1.901564, -49.974076 1.736483, -49.947101 1.04619, -50.699251 0.222984, -50.388211 -0.078445, -48.620567 -0.235489, -48.584497 -1.237805, -47.824956 -0.581618, -46.566584 -0.941028, -44.905703 -1.55174, -44.417619 -2.13775, -44.581589 -2.691308, -43.418791 -2.38311, -41.472657 -2.912018, -39.978665 -2.873054, -38.500383 -3.700652, -37.223252 -4.820946, -36.452937 -5.109404, -35.597796 -5.149504, -35.235389 -5.464937, -34.89603 -6.738193, -34.729993 -7.343221, -35.128212 -8.996401, -35.636967 -9.649282, -37.046519 -11.040721, -37.683612 -12.171195, -38.423877 -13.038119, -38.673887 -13.057652, -38.953276 -13.79337, -38.882298 -15.667054, -39.161092 -17.208407, -39.267339 -17.867746, -39.583521 -18.262296, -39.760823 -19.599113, -40.774741 -20.904512, -40.944756 -21.937317, -41.754164 -22.370676, -41.988284 -22.97007, -43.074704 -22.967693, -44.647812 -23.351959, -45.352136 -23.796842, -46.472093 -24.088969, -47.648972 -24.885199, -48.495458 -25.877025, -48.641005 -26.623698, -48.474736 -27.175912, -48.66152 -28.186135, -48.888457 -28.674115, -49.587329 -29.224469, -50.696874 -30.984465, -51.576226 -31.777698, -52.256081 -32.24537, -52.7121 -33.196578, -53.373662 -33.768378, -53.650544 -33.202004, -53.209589 -32.727666, -53.787952 -32.047243, -54.572452 -31.494511, -55.60151 -30.853879, -55.973245 -30.883076, -56.976026 -30.109686, -57.625133 -30.216295))',
          circle = new H.map.Circle(
            {lat: -14, lng: -80},
            600000,
            {
              style: {fillColor: 'yellow', lineWidth: 0}
            }
          ),
          polygon = new H.map.Polygon(
            H.util.wkt.toGeometry(brazilWKTgeometry),
            {
              style: {fillColor: 'rgba(255, 0, 0, .5)', lineWidth: 0}
            }
          ),
          rect =  new H.map.Rect(
            new H.geo.Rect(15, -87, 0, -68),
            {
              style: {fillColor: 'gray', lineWidth: 0}
            }
          ),
          polyline =  new H.map.Polyline(
            new H.geo.LineString([-22, -80, 0, -32, -75, 0, -32, -70, 0, -42, -65, 0]),
            {
              style: {strokeColor: 'blue', lineWidth: 8}
            }
          ),
          draggableGroup = new H.map.Group({
            volatility: true // mark the group as volatile for smooth dragging of all it's objects
          });

      // put all objects into one group
      draggableGroup.addObjects([circle, polygon, rect, polyline]);

      // ensure that the objects can receive drag events
      polygon.draggable = true;
      circle.draggable = true;
      rect.draggable = true;
      polyline.draggable = true;

      // place group with objects on the map
      map.addObject(draggableGroup);

      // change mouse cursor if entered any of group's objects
      draggableGroup.addEventListener('pointerenter', function() {
        document.body.style.cursor = 'pointer';
      }, true);

      // change mouse cursor if left any of group's objects
      draggableGroup.addEventListener('pointerleave', function() {
        document.body.style.cursor = 'default';
      }, true);

      // add event listeners for circle object
      circle.addEventListener('dragstart', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target,
            screenPositon = map.geoToScreen(object.getCenter()),
            offset = new H.math.Point(pointer.viewportX - screenPositon.x, pointer.viewportY - screenPositon.y);

        // store difference between starting mouse position and circle's center
        object.setData({
          offset: offset
        });
        evt.stopPropagation();
      });

      circle.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target,
            offset = object.getData()['offset'];

        object.setCenter(map.screenToGeo(pointer.viewportX - offset.x, pointer.viewportY - offset.y));
        evt.stopPropagation();
      });

      // add event listeners for polygon object
      polygon.addEventListener('dragstart', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target;

        // store the starting geo position
        object.setData({
          startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
        });
        evt.stopPropagation();
      });

      polygon.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target,
            startCoord = object.getData()['startCoord'],
            newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY),
            outOfMapView = false;

        if (!newCoord.equals(startCoord)) {
          var currentLineString = object.getGeometry().getExterior(),
              newLineString = new H.geo.LineString();

          // create new LineString with updated coordinates
          currentLineString.eachLatLngAlt(function (lat, lng, alt) {
            var diffLat = (lat - startCoord.lat),
                diffLng = (lng - startCoord.lng),
                newLat =newCoord.lat + diffLat,
                newLng = newCoord.lng + diffLng;

            // prevent dragging to latitude over 90 or -90 degrees to prevent loosing altitude values
            if (newLat >= 90 || newLat <= -90) {
              outOfMapView = true;
              return;
            }

            newLineString.pushLatLngAlt(newLat, newLng, 0);
          });

          if (!outOfMapView) {
            object.setGeometry(new H.geo.Polygon(newLineString));
            object.setData({
              startCoord: newCoord
            });
          }
        }
        evt.stopPropagation();
      });

      // add event listeners for rect object
      rect.addEventListener('dragstart', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target;

        // store the starting geo position
        object.setData({
          startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
        });
        evt.stopPropagation();
      });

      rect.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target,
            startCoord = object.getData()['startCoord'],
            newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY);

        // create new Rect with updated coordinates
        if (!newCoord.equals(startCoord)) {
            var currentGeoRect = object.getGeometry().getBoundingBox();
                newTop = currentGeoRect.getTop() + newCoord.lat - startCoord.lat,
                newLeft = currentGeoRect.getLeft() + newCoord.lng - startCoord.lng,
                newBottom = currentGeoRect.getBottom() + newCoord.lat - startCoord.lat,
                newRight = currentGeoRect.getRight() + newCoord.lng - startCoord.lng,
                newGeoRect = new H.geo.Rect(newTop, newLeft, newBottom, newRight);

            // prevent dragging to latitude over 90 or -90 degrees to prevent loosing altitude values
            if (newTop >= 90 || newBottom <= -90) {
              return;
            }

            object.setBoundingBox(newGeoRect);
            object.setData({
              startCoord: newCoord
            });
        }
        evt.stopPropagation();
      });

      // add event listeners for polyline object
      polyline.addEventListener('dragstart', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target;

        // store the starting geo position
        object.setData({
          startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
        });
        evt.stopPropagation();
      });

      polyline.addEventListener('drag', function(evt) {
        var pointer = evt.currentPointer,
            object = evt.target,
            startCoord = object.getData()['startCoord'],
            newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY),
            outOfMapView = false;

        if (!newCoord.equals(startCoord)) {
            var currentLineString = object.getGeometry(),
                newLineString = new H.geo.LineString();

            // create new LineString with updated coordinates
            currentLineString.eachLatLngAlt(function (lat, lng, alt) {
              var diffLat = (lat - startCoord.lat),
                  diffLng = (lng - startCoord.lng),
                  newLat =newCoord.lat + diffLat,
                  newLng = newCoord.lng + diffLng;

              // prevent dragging to latitude over 90 or -90 degrees
              if (newLat >= 90 || newLat <= -90) {
                outOfMapView = true;
                return;
              }

              newLineString.pushLatLngAlt(newLat, newLng, 0);
            });

            if (!outOfMapView) {
              object.setGeometry(newLineString);
              object.setData({
                startCoord: newCoord
              });
            }
        }
        evt.stopPropagation();
      });
    },*/
    // conect markers:
    connectmarkers(map) {
      const lineString = new H.geo.LineString()
      lineString.pushPoint({ lat: -25.731340, lng: 28.2293 })
      lineString.pushPoint({ lat: -26.2041, lng: 28.0473 })
      map.addObject(new H.map.Polyline(
        lineString, { style: { strokeColor: 'green', lineWidth: 5 }}
      ))
    },

    setUpClickListener(map) {
      // Attach an event listener to map display
      // obtain the coordinates and display in an alert box.
      map.addEventListener('tap', function(evt) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
          evt.currentPointer.viewportY)
        this.clickedlatlanstr = 'Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
                ((coord.lat > 0) ? 'N' : 'S') +
                ' ' + Math.abs(coord.lng.toFixed(4)) +
                ((coord.lng > 0) ? 'E' : 'W')
        console.log(this.clickedlatlanstr)
      })
    },

    initializeHereMap() { // rendering map
      const mapContainer = this.$refs.hereMap
      const H = window.H
      this.center = { lat: this.lat, lng: this.lng }
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers()

      // Instantiate (and display) a map object:
      this.map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 10,
        center: this.center
        // center object { lat: 40.730610, lng: -73.935242 }
      })

      addEventListener('resize', () => this.map.getViewPort().resize())

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map))

      // add UI
      H.ui.UI.createDefault(this.map, maptypes)
      // End rendering the initial map
    },

    addMarkersAndSetViewBounds(map) {
      // create map objects
      var toronto = new H.map.Marker({ lat: -25.731340, lng: 28.2293 })
      var boston = new H.map.Marker({ lat: -26.2041, lng: 28.0473 })
      var washington = new H.map.Marker({ lat: -27.8951, lng: 29.0366 })
      var group = new H.map.Group()

      // add markers to the group
      group.addObjects([toronto, boston, washington])
      map.addObject(group)

      // get geo bounding box for the group and set it to the map
      map.getViewModel().setLookAtData({
        bounds: group.getBoundingBox()
      })
    },
    // Check if a 2D point is inside 2D simple polygon. It works with convex and concave polygons.
    ray_casting(point, polygon) {
      var linestring = polygon.getGeometry().getExterior()
      var n = linestring.getPointCount()
      var is_in = false
      var x = point.lat
      var y = point.lng
      var x1; var x2; var y1; var y2

      for (var i = 0; i < n - 1; ++i) {
        var point1 = linestring.extractPoint(i)
        var point2 = linestring.extractPoint(i + 1)
        x1 = point1.lat
        y1 = point1.lng
        x2 = point2.lat
        y2 = point2.lng
        if (y < y1 != y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
          is_in = !is_in
        }
      }

      return is_in
    },

    addMarkersToMap(map) {
      var pretorialynnwoodMarker = new H.map.Marker({ lat: -25.7643, lng: 28.2673 })
      map.addObject(pretorialynnwoodMarker)

      var svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
        '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
        'text-anchor="middle" fill="${STROKE}" >C</text></svg>'

      // Add the first marker
      var bearsIcon = new H.map.Icon(
        svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'red'))
      var bearsMarker = new H.map.Marker({ lat: -25.731340, lng: 28.2293 },
        { icon: bearsIcon })
      map.addObject(bearsMarker)

      // Add the second marker.

      var mlocation = { lat: -26.731340, lng: 28.5293 }
      var cubsMarker = new H.map.Marker(mlocation)
      console.log(cubsMarker.getGeometry())
      console.log(this.farmbounderies.getGeometry())
      if (this.ray_casting(cubsMarker.getGeometry(), this.farmbounderies)) {
        var cubsIcon = new H.map.Icon(
          svgMarkup.replace('${FILL}', 'white').replace('${STROKE}', 'orange'))
        cubsMarker.setIcon(cubsIcon)
      } else {
        var cubsIcon = new H.map.Icon(
          svgMarkup.replace('${FILL}', 'red').replace('${STROKE}', 'orange'))
        cubsMarker.setIcon(cubsIcon)
      }
      this.markers.push(cubsMarker)

      mlocation = { lat: -25.731340, lng: 28.5293 }
      var cubsMarker1 = new H.map.Marker(mlocation)
      if (this.ray_casting(cubsMarker1.getGeometry(), this.farmbounderies)) {
        var cubsIcon = new H.map.Icon(
          svgMarkup.replace('${FILL}', 'white').replace('${STROKE}', 'orange'))
        cubsMarker1.setIcon(cubsIcon)
      } else {
        var cubsIcon = new H.map.Icon(
          svgMarkup.replace('${FILL}', 'red').replace('${STROKE}', 'orange'))
        cubsMarker1.setIcon(cubsIcon)
      }
      this.markers.push(cubsMarker1)

      /* console.log(cubsMarker.getGeometry())
        var geo = cubsMarker.getGeometry()
        geo.lat = -26.731340
        geo.lng = 28.5293

        cubsMarker.setGeometry(geo)*/
      map.addObject(cubsMarker)
      map.addObject(cubsMarker1)
      // console.log(cubsMarker.getGeometry())
      var ptaMarker = new H.map.Marker({ lat: -25.731340, lng: 28.2293 })
      map.addObject(ptaMarker)

      var parisMarker = new H.map.Marker({ lat: 48.8567, lng: 2.3508 })
      map.addObject(parisMarker)

      var romeMarker = new H.map.Marker({ lat: 41.9, lng: 12.5 })
      map.addObject(romeMarker)

      var berlinMarker = new H.map.Marker({ lat: 52.5166, lng: 13.3833 })
      map.addObject(berlinMarker)

      var madridMarker = new H.map.Marker({ lat: 40.4, lng: -3.6833 })
      map.addObject(madridMarker)

      var londonMarker = new H.map.Marker({ lat: 51.5008, lng: -0.1224 })
      map.addObject(londonMarker)
    },
    removemarkers(map) {
      map.removeObjects(this.markers)
    }
  }
}
</script>

<style scoped>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style>
