namespace ws3d.common.map {
    class GroupElement {
        constructor(e)
    }
    class KmlLayerElement {
        constructor(e)
    }
    class Map {

        constructor()
    
        description
        initialExtent
        mapElements
        measureHeightModeGlobePointColor: Color;
        measureHeightModeLineColor: Color;
        measureHeightModeMessageBackgroundColor: Color;
        measureHeightModeMessageFillColor: Color;
        measureHeightModeMessageFont
        measureHeightModeMessageFunction
        measureHeightModeMessageOutlineColorColor: Color;
        measureHeightModePickedPointColor: Color;
        pickingEnabled
        terrain
    
        readonly mapElements
        readonly terrain
    
        onMeasureHeightChange: Event<(
            windowPosition: ws3d.common.Cartesian2,
            pickedCartesian: ws3d.common.Cartesian3 | undefined,
            pickedCartographic: ws3d.common.Cartographic | undefined,
            globeSurfaceCartesian: ws3d.common.Cartesian3 | undefined,
            globeSurfaceCartographic: ws3d.common.Cartographic | undefined,
            relativeToGroundHeight: number,
            buildingInfo: any | undefined // TODO
        ) => void>;
    
        measureHeightModeMessageFunction: (
            longitude: number,
            latitude: number,
            terrainHeight: number,
            buildingHeight: number,
            globalHeight: number | null
        ) => void;
    
        addElement(e,t,i)
        changeTerrainElevationLayer(e,t)
        changeTerrainImageryLayer(e)
        clearAllHighlightedFeatures()
        existsPathName(e)
        exportImageAsDataURL(e)
        getElementArray(e)
        getElementById(e)
        getElementByPath(e)
        getElementIdArray()
        getElementsCount()
        getHeight()
        getMapElementDataSource(e)
        getPathNameArray()
        getTerrainElevationLayerInfo()
        getTerrainElevationLayerType()
        getTerrainImageryLayerInfo()
        getTerrainImageryLayerType()
        getWidth()
        hideThreeDTileLayerElementBoundingVolume()
        loadFromJson(e,r,o,t)
        loadFromJsonPrivatePart(e,t)
        loadFromUrl(t,i,n,r,o)
        removeAllElements()
        removeElement(e)
        removeElementById(e)
        removeElementByPathName(e)
        removeMapElementDataSource(e)
        saveToJson()
        saveToJsonPrivatePartWithRelativePath(e)
        saveToJsonWithRelativePath(e)
        setMapElementDataSource(e,t)
        showThreeDTileLayerElementBoundingVolume()
        startMeasureHeight(params: {
            onMeasureHeightEnd: () => void,
            continueMode: boolean,
            measureDepth?: boolean,
            measureHeight?: boolean,
            measureZero?: boolean
        })
        stopMeasureHeight()
        
    }
    class PoiElement {
        constructor(e)
    }
    class SingleImageLayerElement {
        constructor(e)
    }
    class TerrainEraserElement {
        constructor(e)
    }
    class TerrainModifierElement {
        constructor(e)
    }
    class ThreeDTileLayerElement {
        constructor(e)
    }
    class TmsLayerElement {
        constructor(e)
    }
    class WfsLayerElement {
        constructor(e)
    }
    class WmsLayerElement {
        constructor(e)
    }
}