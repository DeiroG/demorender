define([
    "esri/WebScene",
    "esri/Graphic",

    "esri/views/SceneView",

    "esri/layers/Layer",
    "esri/layers/SceneLayer",
    "esri/layers/support/LabelClass",

    "esri/geometry/geometryEngine",
    "esri/geometry/Polyline",
    "esri/geometry/Point",

    "esri/config",
    "esri/request",
    "dojo/promise/all"
  ],
  function (
    WebScene,
    Graphic,

    SceneView,

    Layer,
    SceneLayer,
    LabelClass,

    geometryEngine,
    Polyline,
    Point,

    esriConfig,
    esriRequest,
    all
  ) {
    var webscene, view, buildingsLayer, projectLayer;

    const websceneId = "67b167e43e5b46ee9990d7b369264045";
    const layerId = "f5be35aea750463f916dff39362a5072";
    const projectLayerId = "613b0ee820e249db9b23f1eafefc2cea";
    const portalUrl = "https://www.arcgis.com";

    return {
      title: "Visualización de la ciudad - Bogotá, Colombia",

      setup: function () {

        webscene = new WebScene({
          portalItem: {
            id: websceneId
          }
        });

        view = new SceneView({
          map: webscene,
          container: "viewDiv",
          padding: {
            top: 70,
            right: 500
          },
          ui: {
            padding: {
              right: 150
            }
          },
          qualityProfile: "high",
          environment: {
            lighting: {
              directShadowsEnabled: true,
              ambientOcclusionEnabled: true
            },
            atmosphereEnabled: true,
            atmosphere: {
              quality: "high"
            },
            starsEnabled: false
          }
        });

        window.view = view;

        Layer.fromPortalItem({
            id: layerId,
            portal: {
              url: portalUrl
            }
          })
          .then(layer => {
            buildingsLayer = layer;
            webscene.add(buildingsLayer);
          });

        view.ui.empty("top-left");
      },

      steps: [

        /////////////////////////////////////////////////////////////////////////////////
        //
        // Step 1: Load a webscene from portalItem
        //
        /////////////////////////////////////////////////////////////////////////////////

        /* {

          title: "Load a webscene",

          code: `
const webscene = new WebScene({
  portalItem: {
    id: "5bc9b920f00243d99593426ece0059c3"
  }
});

Layer.fromPortalItem({
  id: layerId,
  portal: {
    url: portalUrl
  }
})
.then(layer => {
  webscene.add(layer);
});
`,

          before: function () {
            // do nothing
          }

        },
 */
        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 2: Add edges
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Agregar ejes",

          code: `
buildingsLayer.renderer = {
  type: 'simple',
  symbol: {
    type: 'mesh-3d',
    symbolLayers: [{
      type: 'fill',
      material: {
        color: [255, 255, 255, 0.4]
      },
      edges: {
        type: 'solid',
        color: [0, 0, 0, 0.6]
      }
    }]
  }
  }
`,
          before: function () {
            console.log(buildingsLayer);
          },

          run: function () {
            buildingsLayer.renderer = {
              type: 'simple',
              symbol: {
                type: 'mesh-3d',
                symbolLayers: [{
                  type: 'fill',
                  material: {
                    color: [255, 255, 255, 1]
                  },
                  edges: {
                    type: 'solid',
                    color: [0, 0, 0, 0.4]
                  }
                }]
              }
            }
          }
        },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 3: Add a project area
        //
        /////////////////////////////////////////////////////////////////////////////////

        {
          title: "Agregar capa de proyecto y arbolado",

          code: `
const projectLayer = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/DDzi7vRExVRMO5AB/arcgis/rest/services/Propuesta_Contrucci%C3%B3n/SceneServer"
});
arboladoLayer = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/DDzi7vRExVRMO5AB/arcgis/rest/services/Arbolado_Prop_Mul_DG/SceneServer"
});
webscene.add(projectLayer);
webscene.add(arboladoLayer);
`,
          before: function () {

            // zoom to slide that focuses on Macun hiking trail
            view.goTo(view.map.presentation.slides.getItemAt(1).viewpoint);
          },

          run: function () {

            projectLayer = new SceneLayer({
              url: "https://tiles.arcgis.com/tiles/DDzi7vRExVRMO5AB/arcgis/rest/services/Propuesta_Contrucci%C3%B3n/SceneServer"
            });

            arboladoLayer = new SceneLayer({
              url: "https://tiles.arcgis.com/tiles/DDzi7vRExVRMO5AB/arcgis/rest/services/Arbolado_Prop_Mul_DG/SceneServer"
            });


            webscene.add(projectLayer);
            webscene.add(arboladoLayer);

          }
        },
        {
          title: "Agregar un renderizador de borde de boceto para la capa de proyecto",
          code: `
projectLayer.renderer = {
  type: 'simple',
  symbol: {
    type: 'mesh-3d',
    symbolLayers: [{
      type: 'fill',
      material: { color: [255, 176, 7, 1] },
      edges: {
        type: "sketch",
        size: 1,
        color: [255, 176, 7, 1],
        extensionLength: 10
      }
    }]
  }
};
`,
          before: function () {
            // do nothing
          },
          run: function () {
            projectLayer.renderer = {
              type: 'simple',
              symbol: {
                type: 'mesh-3d',
                symbolLayers: [{
                  type: 'fill',
                  material: { color: [255, 176, 7, 1] },
                  edges: {
                    type: "sketch",
                    size: 1,
                    color: [0, 0, 0, 1],
                    extensionLength: 10
                  }
                }]
              }
            }
          }
        },

      ]
    }
  });
